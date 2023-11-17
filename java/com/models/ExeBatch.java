package com.models;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;

import com.controller.InstanceInfo;
import com.generic.QueryExe;
import com.generic.utils;

@Scope("session")
public class ExeBatch {

	Map<String, String> params = null;
	Map<String, Object> mapParas = new HashMap<String, Object>();
	Map<String, Object> mapCommonVar = new HashMap<String, Object>();
	Map<String, Object> mapFlds1 = new HashMap<String, Object>();
	Map<String, Object> mapFlds2 = new HashMap<String, Object>();
	String kf = "";
	String before_exec_sql = "";
	String rep_paraVals = "";
	String fieldValues = "";
	String sqlsBeg = "";
	String sqls = "";
	String sql = "";
	double jv_kf = -1;
	String jv_descr = "";
	String jv_no = "";
	String jv_date = "";
	Connection con = null;
	SimpleDateFormat sdf;
	ResultSet rs = null;
	@Autowired
	private InstanceInfo instanceInfo;

	public ExeBatch(Map<String, String> params, InstanceInfo ins) {
		this.params = params;
		this.instanceInfo = ins;
		this.con = instanceInfo.getmDbc().getDbConnection();
		this.sdf = new SimpleDateFormat(instanceInfo.getMmapVar().get("ENGLISH_DATE_FORMAT") + "");
		kf = params.get("keyfld");
	}

	private void readParas() throws Exception {
		// reading parameters from c7_batches_para
		rs = QueryExe.getSqlRS("select *from C7_BATCHES_PARA where keyfld='" + kf + "'", con);
		rs.beforeFirst();
		while (rs.next()) {
			Object vl = utils.nvlObj(rs.getString("PARA_VALUE"), "");
			if (rs.getString("PROMPT").equals("N") && rs.getString("SQLVALUE") != null
					&& rs.getString("SQLVALUE").isEmpty()) {
				vl = QueryExe.getSqlValue(rs.getString("SQLVALUE"), con, "");
			}
			if (vl.toString().startsWith("@") && !vl.toString().startsWith("@$"))
				vl = sdf.parse(vl.toString().substring(1));
			mapParas.put(rs.getString("PARA_NAME"), vl);
		}
		rs.close();
		// over riding parameters from params
		for (String key : params.keySet()) {
			mapParas.put(key.replace("_para_", ""), params.get(key));
			if (params.get(key).startsWith("@"))
				mapParas.put(key.replace("_para_", ""), (sdf.parse(params.get(key).substring(1))));
		}
	}

	public String execute() {
		String retStr = "{\"ret\":\"SUCCESS\", \"message\":\" JV Generated \" } ";

		try {
			// c7_batches: before exec sql and report parameter values
			con.setAutoCommit(false);
			rs = QueryExe.getSqlRS("select *from c7_batches where keyfld='" + kf + "'", con);
			if (rs.first()) {
				before_exec_sql = rs.getString("BEFORE_EXEC_SQL");
				rep_paraVals = rs.getString("REPORT_PARAVALUES");
			}
			rs.close();
			readParas();
			if (before_exec_sql!=null && !before_exec_sql.isEmpty()) {
				exeSql(before_exec_sql);

			}

			// loop c7_batch_1
			rs = QueryExe.getSqlRS("select *from C7_BATCHES_1 where keyfld='" + kf + "' order by bat_id", con);
			if (rs != null && rs.first()) {
				rs.beforeFirst();
				while (rs.next()) {
					fieldValues = rs.getString("FIELDVALUES");
					String[] fvs = fieldValues.split(" ");
					mapFlds1.clear();
					for (int fi = 0; fi < fvs.length; fi++) {

						String[] fv = fvs[fi].split("=");
						mapFlds1.put(fv[0], fv[1].replaceAll("%20", " "));
						if (fv[1].startsWith("@"))
							mapFlds1.put(fv[0], utils.getOraDateValue(fv[1].substring(1)));
					}

					if (rs.getString("BAT_TYPE").equals("JV")) {
						genJv();
					}
					if (rs.getString("BAT_TYPE").equals("PVB")) {
						genPv(1);
					}
					if (rs.getString("BAT_TYPE").equals("RVB")) {
						genRv(1);
					}					
					if (rs.getString("BAT_TYPE").equals("PVC")) {
						genPv(2);
					}
					if (rs.getString("BAT_TYPE").equals("RVC")) {
						genRv(2);
					}

				}
			}
			if (rs != null)
				rs.close();
			con.commit();
		} catch (Exception e) {
			// TODO Auto-generated catch block
			if (utils.nvl(e.getMessage(), "").length() > 50)
				retStr = "{\"ret\":\"FAILED\", \"message\":\""
						+ utils.decodeEscape(utils.nvl(e.getMessage(), "")).substring(0, 50) + "\" } ";
			else
				retStr = "{\"ret\":\"FAILED\", \"message\":\"" + utils.decodeEscape(utils.nvl(e.getMessage(), ""))
						+ "\" } ";
			e.printStackTrace();
			try {
				con.rollback();
			} catch (SQLException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
		}

		return retStr;
	}

	private void exeSql(String sqls) throws Exception {
		for (String key : mapParas.keySet()) {
			String vl = mapParas.get(key) + "";
			if (mapParas.get(key) instanceof Date)
				vl = utils.getOraDateValue((Date) mapParas.get(key));
			sqls = sqls.replaceAll(":" + key, vl);
		}
		System.out.println(sqls);
		QueryExe.execute(sqls, con);
	}

	private void genRv(int bnkcash) throws Exception {
		if (bnkcash != 1 && bnkcash != 2)
			throw new Exception("RV parameter be either 1 or 2 !");
		if (utils.nvl(mapFlds1.get("codeacc"), "").isEmpty())
			throw new Exception("RV 'codeacc' must assign in fieldvalues , c7_batches_1!");

		sqlsBeg = "declare amt number:=0; amt_dr number:=0; amt_cr number:=0; nm varchar2(500); "
				+ "totdeb number:=0; totcrd number:=0; kfld number;jvno number; begin "
				+ " SELECT NVL(MAX(KEYFLD),0)+1 INTO KFLD FROM ACVOUCHER1; "
				+ "SELECT NVL(MAX(NO),0)+1 INTO JVNO FROM ACVOUCHER1 WHERE VOU_CODE=2 AND TYPE=" + bnkcash + ";";

		ResultSet rs2 = QueryExe.getSqlRS("select *from C7_BATCHES_2 where keyfld='" + kf + "' and bat_id="
				+ rs.getString("bat_id") + " order by pos", con);
		rs2.beforeFirst();
		String sql2 = "";
		String sqls2 = "";
		int cnt = 0;
		while (rs2.next()) {

			cnt++;
			sql2 = " if ':cust_code' is null then select name into nm from acaccount where accno='"
					+ rs2.getString("fld_accno") + "' AND ACTYPE=0 AND CHILDCOUNT=0 AND FLAG=1; else  "
					+ " select name into nm from c_ycust where code='" + rs2.getString("FLD_RP_CODE")
					+ "' and childcount=0 and flag=1; end if; amt:=:amount; amt_dr:=0;amt_cr:=0;"
					+ "if (amt>=0) then amt_dr:=:amount; else raise value_error; end if;" + "if amt!=0 then "
					+ "INSERT INTO ACVOUCHER2(periodcode,keyfld,no,vou_code,vou_date,"
					+ "flag,debit,credit,accno,descr,descr2,creatdt,usernm,"
					+ "pos,year,type,costcent,fcdebit,fccredit ,cust_code,branch_no) VALUES ("
					+ "repair.getcurperiodcode(),kfld,jvno,2,:vou_date,"
					+ ":flag,:debit,:credit,:accno,':descr',:descr2,sysdate,:usernm,"
					+ ":pos,'2003',:type,':costcent',:fcdebit,:fccredit, ':cust_code',':branch_no');"
					+ " totdeb:=totdeb + amt_dr ; " + "totcrd:=totcrd + amt_cr ;" + "end if; "
					+ " if ':cust_code' is not null then "
					+ " update acvoucher2 set accno=(select ac_no from c_ycust where code=':cust_code') where keyfld=kfld and pos=:pos;"
					+ "end if;"; // if amt!=0

			sql2 = sql2.replaceAll(":vou_date", utils.nvl(mapFlds1.get("vou_date"), "trunc(sysdate)"));
			sql2 = sql2.replaceAll(":flag", "'" + (rs.getString("DO_POST").equals("Y") ? "2" : "1") + "'");
			sql2 = sql2.replaceAll(":debit", "amt_cr");
			sql2 = sql2.replaceAll(":credit", "amt_dr");
			sql2 = sql2.replaceAll(":accno", "'" + rs2.getString("fld_accno") + "'");
			sql2 = sql2.replaceAll(":descr2", "nm");
			sql2 = sql2.replaceAll(":descr", utils.nvl(rs2.getString("fld_descr"), mapFlds1.get("descr")));
			sql2 = sql2.replaceAll(":usernm", "'" + instanceInfo.getmLoginUser() + "'");
			sql2 = sql2.replaceAll(":pos", (cnt + 1) + "");
			sql2 = sql2.replaceAll(":costcent", utils.nvl(rs2.getString("FLD_COSTCENT"), ""));
			sql2 = sql2.replaceAll(":fcdebit", "amt_cr");
			sql2 = sql2.replaceAll(":fccredit", "amt_dr");
			sql2 = sql2.replaceAll(":cust_code", utils.nvl(rs2.getString("FLD_RP_CODE"), ""));
			sql2 = sql2.replaceAll(":branch_no", utils.nvl(rs2.getString("FLD_RP_BRANCH"), "null"));
			sql2 = sql2.replaceAll(":amount", rs2.getString("AMOUNT"));
			sql2 = sql2.replaceAll(":type", bnkcash + "");
			sqls2 += sql2;

		}
		rs2.close();
		if (cnt > 0) {
			cnt++;
			sql2 = " select name into nm from acaccount where accno='" + mapFlds1.get("codeacc")
					+ "' AND ACTYPE=0 AND CHILDCOUNT=0 AND FLAG=1; " + " if totdeb>0 then "
					+ "INSERT INTO ACVOUCHER2(periodcode,keyfld,no,vou_code,vou_date,"
					+ "flag,debit,credit,accno,descr,descr2,creatdt,usernm,"
					+ "pos,year,type,costcent,fcdebit,fccredit ) VALUES ("
					+ "repair.getcurperiodcode(),kfld,jvno,2,:vou_date,"
					+ ":flag,:debit,:credit,:accno,':descr',:descr2,sysdate,:usernm,"
					+ ":pos,'2003',:type,':costcent',:fcdebit,:fccredit );" + " " + "totcrd:=totdeb ;" + "end if; "; // if
																														// amt!=0

			sql2 = sql2.replaceAll(":vou_date", utils.nvl(mapFlds1.get("vou_date"), "trunc(sysdate)"));
			sql2 = sql2.replaceAll(":flag", "'" + (rs.getString("DO_POST").equals("Y") ? "2" : "1") + "'");
			sql2 = sql2.replaceAll(":debit", "totdeb");
			sql2 = sql2.replaceAll(":credit", "0");
			sql2 = sql2.replaceAll(":accno", "'" + mapFlds1.get("codeacc") + "'");
			sql2 = sql2.replaceAll(":descr2", "nm");
			sql2 = sql2.replaceAll(":descr", utils.nvl(mapFlds1.get("descr"), mapFlds1.get("descr")));
			sql2 = sql2.replaceAll(":usernm", "'" + instanceInfo.getmLoginUser() + "'");
			sql2 = sql2.replaceAll(":pos", (cnt + 1) + "");
			sql2 = sql2.replaceAll(":costcent", utils.nvl(mapFlds1.get("costcent"), ""));
			sql2 = sql2.replaceAll(":fcdebit", "totdeb");
			sql2 = sql2.replaceAll(":fccredit", "0");
			sql2 = sql2.replaceAll(":type", (bnkcash + 5) + "");
			sqls2 += sql2;

			sql = " if totdeb>0 then INSERT INTO acvoucher1 "
					+ "(periodcode, keyfld, NO, vou_code, vou_date, flag, debamt,"
					+ "crdamt, descr, usernm, creatdt, YEAR, TYPE, CODEACC ,code , slsmn, rcvfrom, bookserialno )  VALUES ("
					+ ":periodcode, :keyfld, :no, :vou_code, :vou_date, :flag, :debamt,"
					+ ":crdamt, :descr, :usernm, :creatdt, :year, :type, :codeacc ,:code ,null, ':rcvfrom' ,':bookserialno' ); end if; ";
			sql = sql.replaceAll(":periodcode", "repair.getcurperiodcode()");
			sql = sql.replaceAll(":keyfld", "KFLD");
			sql = sql.replaceAll(":no", "jvno");
			sql = sql.replaceAll(":vou_code", "2");
			sql = sql.replaceAll(":vou_date", utils.nvl(mapFlds1.get("vou_date"), "trunc(sysdate)"));
			sql = sql.replaceAll(":flag", "'" + (rs.getString("DO_POST").equals("Y") ? "2" : "1") + "'");
			sql = sql.replaceAll(":debamt", "0");
			sql = sql.replaceAll(":crdamt", "0");
			sql = sql.replaceAll(":descr", "'" + utils.nvl(mapFlds1.get("descr"), "Batch # " + kf) + "'");
			sql = sql.replaceAll(":usernm", "'" + instanceInfo.getmLoginUser() + "'");
			sql = sql.replaceAll(":creatdt", "sysdate");
			sql = sql.replaceAll(":year", "'2003'");
			sql = sql.replaceAll(":rcvfrom", utils.nvl(mapFlds1.get("rcvfrom"), "batch"));
			sql = sql.replaceAll(":bookserialno", utils.nvl(mapFlds1.get("bookserialno"), ""));
			sql = sql.replaceAll(":type", (bnkcash) + "");
			sql = sql.replaceAll(":codeacc", utils.nvl(mapFlds1.get("codeacc"), ""));
			sql = sql.replaceAll(":code", utils.nvl(mapFlds1.get("codeacc"), ""));

			sqls = sqlsBeg + sqls2 + sql;

			sqls += " if (totdeb<>totcrd) then raise value_error; end if; update acvoucher1 set codeamt=totdeb,debamt=totdeb,crdamt=totcrd where keyfld=kfld; end;";
			// parsing parameters
			for (String key : mapParas.keySet()) {
				String vl = mapParas.get(key) + "";
				if (mapParas.get(key) instanceof Date)
					vl = utils.getOraDateValue((Date) mapParas.get(key));
				sqls = sqls.replaceAll(":" + key, vl);
			}
//			QueryExe.execute(sqls, con);
			System.out.println(sqls);
			QueryExe.execute(sqls, con);
		}

	}

	private void genPv(int bnkcash) throws Exception {
		if (bnkcash != 1 && bnkcash != 2)
			throw new Exception("PV parameter be either 1 or 2 !");
		if (utils.nvl(mapFlds1.get("codeacc"), "").isEmpty())
			throw new Exception("PV 'codeacc' must assign in fieldvalues , c7_batches_1!");

		sqlsBeg = "declare amt number:=0; amt_dr number:=0; amt_cr number:=0; nm varchar2(500); "
				+ "totdeb number:=0; totcrd number:=0; kfld number;jvno number; begin "
				+ " SELECT NVL(MAX(KEYFLD),0)+1 INTO KFLD FROM ACVOUCHER1; "
				+ "SELECT NVL(MAX(NO),0)+1 INTO JVNO FROM ACVOUCHER1 WHERE VOU_CODE=3 AND TYPE=" + bnkcash + ";";

		ResultSet rs2 = QueryExe.getSqlRS("select *from C7_BATCHES_2 where keyfld='" + kf + "' and bat_id="
				+ rs.getString("bat_id") + " order by pos", con);
		rs2.beforeFirst();
		String sql2 = "";
		String sqls2 = "";
		int cnt = 0;
		while (rs2.next()) {

			cnt++;
			sql2 = " if ':cust_code' is null then select name into nm from acaccount where accno='"
					+ rs2.getString("fld_accno") + "' AND ACTYPE=0 AND CHILDCOUNT=0 AND FLAG=1; else  "
					+ " select name into nm from c_ycust where code='" + rs2.getString("FLD_RP_CODE")
					+ "' and childcount=0 and flag=1; end if; amt:=:amount; amt_dr:=0;amt_cr:=0;"
					+ "if (amt>=0) then amt_dr:=:amount; else raise value_error; end if;" + "if amt!=0 then "
					+ "INSERT INTO ACVOUCHER2(periodcode,keyfld,no,vou_code,vou_date,"
					+ "flag,debit,credit,accno,descr,descr2,creatdt,usernm,"
					+ "pos,year,type,costcent,fcdebit,fccredit ,cust_code,branch_no) VALUES ("
					+ "repair.getcurperiodcode(),kfld,jvno,3,:vou_date,"
					+ ":flag,:debit,:credit,:accno,':descr',:descr2,sysdate,:usernm,"
					+ ":pos,'2003',:type,':costcent',:fcdebit,:fccredit, ':cust_code',':branch_no');"
					+ " totdeb:=totdeb + amt_dr ; " + "totcrd:=totcrd + amt_cr ;" + "end if; "
					+ " if ':cust_code' is not null then "
					+ " update acvoucher2 set accno=(select ac_no from c_ycust where code=':cust_code') where keyfld=kfld and pos=:pos;"
					+ "end if;"; // if amt!=0

			sql2 = sql2.replaceAll(":vou_date", utils.nvl(mapFlds1.get("vou_date"), "trunc(sysdate)"));
			sql2 = sql2.replaceAll(":flag", "'" + (rs.getString("DO_POST").equals("Y") ? "2" : "1") + "'");
			sql2 = sql2.replaceAll(":debit", "amt_dr");
			sql2 = sql2.replaceAll(":credit", "amt_cr");
			sql2 = sql2.replaceAll(":accno", "'" + rs2.getString("fld_accno") + "'");
			sql2 = sql2.replaceAll(":descr2", "nm");
			sql2 = sql2.replaceAll(":descr", utils.nvl(rs2.getString("fld_descr"), mapFlds1.get("descr")));
			sql2 = sql2.replaceAll(":usernm", "'" + instanceInfo.getmLoginUser() + "'");
			sql2 = sql2.replaceAll(":pos", (cnt + 1) + "");
			sql2 = sql2.replaceAll(":costcent", utils.nvl(rs2.getString("FLD_COSTCENT"), ""));
			sql2 = sql2.replaceAll(":fcdebit", "amt_dr");
			sql2 = sql2.replaceAll(":fccredit", "amt_cr");
			sql2 = sql2.replaceAll(":cust_code", utils.nvl(rs2.getString("FLD_RP_CODE"), ""));
			sql2 = sql2.replaceAll(":branch_no", utils.nvl(rs2.getString("FLD_RP_BRANCH"), "null"));
			sql2 = sql2.replaceAll(":amount", rs2.getString("AMOUNT"));
			sql2 = sql2.replaceAll(":type", bnkcash + "");
			sqls2 += sql2;

		}
		rs2.close();
		if (cnt > 0) {
			cnt++;
			sql2 = " select name into nm from acaccount where accno='" + mapFlds1.get("codeacc")
					+ "' AND ACTYPE=0 AND CHILDCOUNT=0 AND FLAG=1; " + " if totdeb>0 then "
					+ "INSERT INTO ACVOUCHER2(periodcode,keyfld,no,vou_code,vou_date,"
					+ "flag,debit,credit,accno,descr,descr2,creatdt,usernm,"
					+ "pos,year,type,costcent,fcdebit,fccredit ) VALUES ("
					+ "repair.getcurperiodcode(),kfld,jvno,3,:vou_date,"
					+ ":flag,:debit,:credit,:accno,':descr',:descr2,sysdate,:usernm,"
					+ ":pos,'2003',:type,':costcent',:fcdebit,:fccredit );" + " " + "totcrd:=totdeb ;" + "end if; "; // if
																														// amt!=0

			sql2 = sql2.replaceAll(":vou_date", utils.nvl(mapFlds1.get("vou_date"), "trunc(sysdate)"));
			sql2 = sql2.replaceAll(":flag", "'" + (rs.getString("DO_POST").equals("Y") ? "2" : "1") + "'");
			sql2 = sql2.replaceAll(":debit", "0");
			sql2 = sql2.replaceAll(":credit", "totdeb");
			sql2 = sql2.replaceAll(":accno", "'" + mapFlds1.get("codeacc") + "'");
			sql2 = sql2.replaceAll(":descr2", "nm");
			sql2 = sql2.replaceAll(":descr", utils.nvl(mapFlds1.get("descr"), mapFlds1.get("descr")));
			sql2 = sql2.replaceAll(":usernm", "'" + instanceInfo.getmLoginUser() + "'");
			sql2 = sql2.replaceAll(":pos", (cnt + 1) + "");
			sql2 = sql2.replaceAll(":costcent", utils.nvl(mapFlds1.get("costcent"), ""));
			sql2 = sql2.replaceAll(":fcdebit", "0");
			sql2 = sql2.replaceAll(":fccredit", "totdeb");
			sql2 = sql2.replaceAll(":type", (bnkcash + 5) + "");
			sqls2 += sql2;

			sql = " if totdeb>0 then INSERT INTO acvoucher1 "
					+ "(periodcode, keyfld, NO, vou_code, vou_date, flag, debamt,"
					+ "crdamt, descr, usernm, creatdt, YEAR, TYPE, CODEACC ,code , slsmn, rcvfrom ,bookserialno )  VALUES ("
					+ ":periodcode, :keyfld, :no, :vou_code, :vou_date, :flag, :debamt,"
					+ ":crdamt, :descr, :usernm, :creatdt, :year, :type, :codeacc ,:code ,null, ':rcvfrom' ,':bookserialno' ); end if; ";
			sql = sql.replaceAll(":periodcode", "repair.getcurperiodcode()");
			sql = sql.replaceAll(":keyfld", "KFLD");
			sql = sql.replaceAll(":no", "jvno");
			sql = sql.replaceAll(":vou_code", "3");
			sql = sql.replaceAll(":vou_date", utils.nvl(mapFlds1.get("vou_date"), "trunc(sysdate)"));
			sql = sql.replaceAll(":flag", "'" + (rs.getString("DO_POST").equals("Y") ? "2" : "1") + "'");
			sql = sql.replaceAll(":debamt", "0");
			sql = sql.replaceAll(":crdamt", "0");
			sql = sql.replaceAll(":descr", "'" + utils.nvl(mapFlds1.get("descr"), "Batch # " + kf) + "'");
			sql = sql.replaceAll(":usernm", "'" + instanceInfo.getmLoginUser() + "'");
			sql = sql.replaceAll(":creatdt", "sysdate");
			sql = sql.replaceAll(":year", "'2003'");
			sql = sql.replaceAll(":rcvfrom", utils.nvl(mapFlds1.get("payto"), "batch"));
			sql = sql.replaceAll(":bookserialno", utils.nvl(mapFlds1.get("bookserialno"), ""));
			sql = sql.replaceAll(":type", (bnkcash) + "");
			sql = sql.replaceAll(":codeacc", utils.nvl(mapFlds1.get("codeacc"), ""));
			sql = sql.replaceAll(":code", utils.nvl(mapFlds1.get("codeacc"), ""));

			sqls = sqlsBeg + sqls2 + sql;

			sqls += " if (totdeb<>totcrd) then raise value_error; end if; update acvoucher1 set codeamt=totdeb,debamt=totdeb,crdamt=totcrd where keyfld=kfld; end;";
			// parsing parameters
			for (String key : mapParas.keySet()) {
				String vl = mapParas.get(key) + "";
				if (mapParas.get(key) instanceof Date)
					vl = utils.getOraDateValue((Date) mapParas.get(key));
				sqls = sqls.replaceAll(":" + key, vl);
			}
//			QueryExe.execute(sqls, con);
			System.out.println(sqls);
			QueryExe.execute(sqls, con);
		}

	}

	private void genJv() throws Exception {

		sqlsBeg = "declare amt number:=0; amt_dr number:=0; amt_cr number:=0; nm varchar2(500); "
				+ "totdeb number:=0; totcrd number:=0; kfld number;jvno number; begin "
				+ " SELECT NVL(MAX(KEYFLD),0)+1 INTO KFLD FROM ACVOUCHER1; "
				+ " SELECT NVL(MAX(NO),0)+1 INTO JVNO FROM ACVOUCHER1 WHERE VOU_CODE=1 AND TYPE=1;";

		ResultSet rs2 = QueryExe.getSqlRS("select *from C7_BATCHES_2 where keyfld='" + kf + "' and bat_id="
				+ rs.getString("bat_id") + " order by pos", con);
		rs2.beforeFirst();
		String sql2 = "";
		String sqls2 = "";
		int cnt = 0;
		while (rs2.next()) {

			cnt++;
			sql2 = " if ':cust_code' is null then select name into nm from acaccount where accno='"
					+ rs2.getString("fld_accno") + "' AND ACTYPE=0 AND CHILDCOUNT=0 AND FLAG=1; else "
					+ " select name into nm from c_ycust where code='" + rs2.getString("FLD_RP_CODE")
					+ "' and childcount=0 and flag=1; end if; amt:=:amount; amt_dr:=0;amt_cr:=0;"
					+ "if (amt>0) then amt_dr:=:amount; else amt_cr:=abs(:amount); end if;" + "if amt!=0 then "
					+ "INSERT INTO ACVOUCHER2(periodcode,keyfld,no,vou_code,vou_date,"
					+ "flag,debit,credit,accno,descr,descr2,creatdt,usernm,"
					+ "pos,year,type,costcent,fcdebit,fccredit, cust_code,branch_no ) VALUES ("
					+ "repair.getcurperiodcode(),kfld,jvno,1,:vou_date,"
					+ ":flag,:debit,:credit,:accno,':descr',:descr2,sysdate,:usernm,"
					+ ":pos,'2003',1,':costcent',:fcdebit,:fccredit , ':cust_code',':branch_no' );"
					+ " totdeb:=totdeb + amt_dr ; " + "totcrd:=totcrd + amt_cr ;" + "end if; "
					+ "if ':cust_code' is not null then "
					+ " update acvoucher2 set accno=(select ac_no from c_ycust where code=':cust_code') where keyfld=kfld and pos=:pos;"
					+ "end if;"; // if amt!=0

			sql2 = sql2.replaceAll(":vou_date", utils.nvl(mapFlds1.get("vou_date"), "trunc(sysdate)"));
			sql2 = sql2.replaceAll(":flag", "'" + (rs.getString("DO_POST").equals("Y") ? "2" : "1") + "'");
			sql2 = sql2.replaceAll(":debit", "amt_dr");
			sql2 = sql2.replaceAll(":credit", "amt_cr");
			sql2 = sql2.replaceAll(":accno", "'" + rs2.getString("fld_accno") + "'");
			sql2 = sql2.replaceAll(":descr2", "nm");
			sql2 = sql2.replaceAll(":descr", utils.nvl(rs2.getString("fld_descr"), mapFlds1.get("descr")));
			sql2 = sql2.replaceAll(":usernm", "'" + instanceInfo.getmLoginUser() + "'");
			sql2 = sql2.replaceAll(":pos", (cnt + 1) + "");
			sql2 = sql2.replaceAll(":costcent", utils.nvl(rs2.getString("FLD_COSTCENT"), ""));
			sql2 = sql2.replaceAll(":fcdebit", "amt_dr");
			sql2 = sql2.replaceAll(":fccredit", "amt_cr");
			sql2 = sql2.replaceAll(":cust_code", utils.nvl(rs2.getString("FLD_RP_CODE"), ""));
			sql2 = sql2.replaceAll(":branch_no", utils.nvl(rs2.getString("FLD_RP_BRANCH"), "null"));
			sql2 = sql2.replaceAll(":amount", rs2.getString("AMOUNT"));

			sqls2 += sql2;

		}
		rs2.close();
		if (cnt > 0) {
			sql = " if totcrd>0 then " + "INSERT INTO acvoucher1 "
					+ "(periodcode, keyfld, NO, vou_code, vou_date, flag, debamt,"
					+ "crdamt, descr, usernm, creatdt, YEAR, TYPE , slsmn , rcvfrom, bookserialno  )  VALUES ("
					+ ":periodcode, :keyfld, :no, :vou_code, :vou_date, :flag, :debamt,"
					+ ":crdamt, :descr, :usernm, :creatdt, :year, :type ,null, null ,':bookserialno' ); end if; ";
			sql = sql.replaceAll(":periodcode", "repair.getcurperiodcode()");
			sql = sql.replaceAll(":keyfld", "KFLD");
			sql = sql.replaceAll(":no", "jvno");
			sql = sql.replaceAll(":vou_code", "1");
			sql = sql.replaceAll(":vou_date", utils.nvl(mapFlds1.get("vou_date"), "trunc(sysdate)"));
			sql = sql.replaceAll(":flag", "'" + (rs.getString("DO_POST").equals("Y") ? "2" : "1") + "'");
			sql = sql.replaceAll(":debamt", "0");
			sql = sql.replaceAll(":crdamt", "0");
			sql = sql.replaceAll(":descr", "'" + utils.nvl(mapFlds1.get("descr"), "Batch # " + kf) + "'");
			sql = sql.replaceAll(":usernm", "'" + instanceInfo.getmLoginUser() + "'");
			sql = sql.replaceAll(":creatdt", "sysdate");
			sql = sql.replaceAll(":year", "'2003'");
			sql = sql.replaceAll(":bookserialno", utils.nvl(mapFlds1.get("bookserialno"), ""));
			sql = sql.replaceAll(":type", "1");

			sqls = sqlsBeg + sqls2 + sql;
			sqls += " if (totdeb<>totcrd) then raise value_error; end if; update acvoucher1 set debamt=totdeb,crdamt=totcrd where keyfld=kfld; end;";
			// parsing parameters
			for (String key : mapParas.keySet()) {
				String vl = mapParas.get(key) + "";
				if (mapParas.get(key) instanceof Date)
					vl = utils.getOraDateValue((Date) mapParas.get(key));
				sqls = sqls.replaceAll(":" + key, vl);
			}
//			QueryExe.execute(sqls, con);
			System.out.println(sqls);
			QueryExe.execute(sqls, con);
		}

	}
}
