package com.controller;

import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import java.util.stream.Collectors;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.multipart.MultipartFile;

import com.generic.DBClass;
import com.generic.QueryExe;
import com.generic.localTableModel;
import com.generic.qryColumn;
import com.generic.utils;
import com.models.Batches;
import com.models.Batches.UserReports;
import com.models.RepBatch7;
import com.tools.queries.QuickRepMetaData;
import com.tools.utilities.BatchSqlJson;
import com.tools.utilities.SQLJson;

/**
 * Main class for REST
 * 
 * @author yusufijiruwala
 * @version 7.0.0
 *
 */

@EnableAsync
@RestController
@Scope("session")
public class UserRoute {

	/**
	 * servletContext path to access local path on server like temporary files,
	 * report files.
	 */
	private String path = "";

	/**
	 * Session ID passed as each and every unique session from browser, which can be
	 * used in database to store temporary reports.
	 */
	private String sessionId = "";

	@Autowired
	private ServletContext servletContext;

	@Autowired
	private InstanceInfo instanceInfo;

	@Autowired
	private Batches batches;

	@Autowired
	private RepBatch7 repBat7;

	@Autowired
	private com.models.Notifications notifications;

	private ResultSet lastRsSave = null;

	private String saveQryPlsql = "";

	private Timer saveQryTimer = new Timer(true);

	public UserRoute() {

	}

	@RequestMapping("/connect")
	public String connectDB() {
		DBClass dbc = instanceInfo.getConnection();
		return dbc.toString();
	}

	@RequestMapping(value = "/signup", method = RequestMethod.GET)
	public String signUpNewUser(Map<String, String> params) {
		if (instanceInfo.getConnection() == null) {
			connectDB();
		}
		DBClass dbc = instanceInfo.getConnection();

		return dbc.toString();
	}

	@RequestMapping(value = "/sqltojson", method = RequestMethod.GET)
	public String getSqlJson(@RequestParam Map<String, String> params) {
		String sql = "";
		localTableModel lctb = new localTableModel();
		try {
			if (!instanceInfo.isMlogonSuccessed())
				throw new SQLException("Access denied !");

			// DBClass dbc = new
			// DBClass(instanceInfo.getmDbc().getDbConnection());
			lctb.createDBClassFromConnection(instanceInfo.getmDbc().getDbConnection());
			sql = buildSql(params);
			lctb.executeQuery(sql, true);

		} catch (SQLException e) {
			e.printStackTrace();
			return "{\"errorMsg\":\"" + e.getMessage() + "\"," + "\"sql\": \" sql -> " + sql + "\" } ";
		}

		return lctb.getJSONData();

	}

	@RequestMapping(value = "/exe", method = RequestMethod.GET)
	public String getCommonData(@RequestParam Map<String, String> params) {

		String ret = "";
		path = servletContext.getRealPath("");
		try {
			// ------------get-init-files
			if (params.get("command").equals("get-init-files")) {
				ret = getInitFiles(params);
				return ret;
			}
			if (params.get("command").equals("get-init-data")) {
				ret = getInitFileData(params);
				return ret;
			}
			if (params.get("command").equals("get-fiscal-data")) {
				ret = getFiscalData(params);
				return ret;
			}

			// ------------if-not-logon
			if (!instanceInfo.isMlogonSuccessed())
				throw new Exception("Access denied !");

			// ------------get-current-profile
			if (params.get("command").equals("get-current-profile")) {
				ret = utils.getJSONStr("code", instanceInfo.getmCurrentProfile(), false);
				ret += "," + utils.getJSONStr("name", instanceInfo.getmCurrentProfileName(), false);
				ret = "{" + ret + "}";
			}

			// ------------get-profile-list
			if (params.get("command").equals("get-profile-list")) {
				ret = "";
				String row = "";
				for (Iterator iterator = instanceInfo.getmListProfiles().iterator(); iterator.hasNext();) {
					String pf = (String) iterator.next();
					row = utils.getJSONStr("code", pf, false);
					row = "{" + row + "," + utils.getJSONStr("name", instanceInfo.getmMapProfiles().get(pf), false)
							+ "}";
					ret += (ret.length() == 0 ? "" : ",") + row;
				}
				ret = "{ \"list\":[" + ret + "]}";
			}

			// ------------get-get-screens
			if (params.get("command").equals("get-screens")) {
				Connection con = instanceInfo.getmDbc().getDbConnection();
				ResultSet rs = QueryExe.getSqlRS(
						"select CODE, DESCR, PROFILES, FLAG, GROUPNAME, ON_DISPLAY, nvl(DESCR_A,descr) DESCR_A  from c6_screens order by code",
						con);
				ret = "{" + utils.getJSONsqlMetaData(rs, con, "", "") + "}";
			}

			// ------------get-quickrep-metadata-header
			if (params.get("command").equals("get-quickrep-metadata")) {
				QuickRepMetaData qrm = new QuickRepMetaData(instanceInfo);
				ret = qrm.getJSONInit(params.get("report-id"));
			}

			// ------------get-quickrep-metadata-columns-groups
			if (params.get("command").equals("get-quickrep-cols")) {
				QuickRepMetaData qrm = new QuickRepMetaData(instanceInfo);
				ret = qrm.getJSONCols(params.get("report-id"));
			}

			// ------------get-quickrep-data
			if (params.get("command").equals("get-quickrep-data")) {
				ret = quickRepData(params);
			}

			// ------------get-quickrep-data
			if (params.get("command").equals("get-batch-status")) {
				ret = getBatchStatus(params);
			}
			// ------------get-batch-params
			if (params.get("command").equals("get-batch-params")) {
				ret = getBatchParams(params);
			}

			if (params.get("command").equals("get-batch-data")) {
				ret = getBatchData(params);
			}

			// ------------get any record if any batch started for same report
			if (params.get("command").equals("get-quickrep-hasbatch")) {
				String rid = params.get("report-id");
				String r = batches.fetchBatchParas(rid, instanceInfo);
				ret = r;
			}

			if (params.get("command").equals("get-graph-query")) {
				ret = buildJsonGraphQuery(params);
			}

			if (params.get("command").equals("get-menu-path")) {
				ret = utils.generateMenuPath(params.get("group"), params.get("parent"), params.get("code"),
						instanceInfo.getmDbc().getDbConnection());
				ret = utils.getJSONStr("return", ret, true);
			}

			if (params.get("command").equals("get-subrep")) {
				String id = params.get("report-id");
				ret = getSubRepJson("subrep", id);
			}

			if (params.get("command").equals("get-option-subreps")) {
				String id = params.get("report-id");
				ret = "";
				Connection con = instanceInfo.getmDbc().getDbConnection();
				ResultSet rs = QueryExe.getSqlRS("select *from c6_subreps where keyfld='" + id + "'order by rep_pos",
						con);
				String subreps = "";
				if (rs != null && rs.first()) {
					if (rs.getString("REP_TYPE").equals("OPTIONS")) {
						String[] op = rs.getString("sql").split(",");
						for (int i = 0; i < op.length; i++) {
							String[] sop = op[i].split("=");
							String js = getSubRepJson(sop[0], sop[1]);
							ret += (ret.length() == 0 ? "" : ",") + js;
						}
					}
					ret = "{" + ret + "}";
					rs.close();
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
			return "{\"errorMsg\":\"" + e.getMessage() + "\"} ";
		}
		return ret;

	}

	@RequestMapping(value = "/login", method = RequestMethod.GET)
	public String execute(@RequestParam Map<String, String> params) {
		String ret = "";
		try {
			if (!params.containsKey("user") || !params.containsKey("password") || !params.containsKey("file"))
				throw new Exception("require parameters .user , password , file");
			sessionId = RequestContextHolder.currentRequestAttributes().getSessionId();
			instanceInfo.sessionId = sessionId;
			ret = instanceInfo.loginUser(params);
			// sessionId = RequestContextHolder.currentRequestAttributes().getSessionId();
			// instanceInfo.sessionId = sessionId;
			QueryExe.execute("begin c6_session.delete_cache('" + instanceInfo.getmLoginUser() + "');end;",
					instanceInfo.getmDbc().getDbConnection());

		} catch (Exception e) {
			e.printStackTrace();
			return "{\"errorMsg\":\"" + e.getMessage() + "\"," + "\"sql\": \" sql -> " + "" + "\" } ";
		}

		return ret;
	}

	@RequestMapping(value = "/settings", method = RequestMethod.GET)
	public String settings(@RequestParam Map<String, String> params) {
		String ret = "";
		try {
			ret = instanceInfo.getSettings();
		} catch (Exception e) {
			e.printStackTrace();
			return "{\"errorMsg\":\"" + e.getMessage() + "\"," + "\"sql\": \" sql -> " + "" + "\" } ";
		}

		return ret;
	}

	@RequestMapping(value = "/sqldata", method = RequestMethod.POST)
	public ResponseEntity<SQLJson> test(@RequestBody SQLJson sql) {
		sql.setRet("ok");
		String retdata = "";
		try {
			if (!instanceInfo.isMlogonSuccessed())
				throw new SQLException("Access denied !");

			Connection con = instanceInfo.getmDbc().getDbConnection();
			QueryExe qe = new QueryExe(sql.getSql(), con);
			ResultSet rs = QueryExe.getSqlRS(sql.getSql(), con);
			retdata = utils.getJSONsql("data", rs, con, "", "");
			sql.setData(retdata);
			sql.setRet("SUCCESS");
			if (rs != null)
				rs.close();
		} catch (SQLException e) {
			sql.setRet("server_error : " + e.getMessage());
			sql.setData("");
			e.printStackTrace();
		}

		return new ResponseEntity<SQLJson>(sql, HttpStatus.OK);
	}

	// -------repbat7 operations.
	@RequestMapping(value = "/bat7addQry", method = RequestMethod.POST)
	public ResponseEntity<BatchSqlJson> bat7addQry(@RequestBody BatchSqlJson sql,
			@RequestParam Map<String, String> params) {
		int rn = repBat7.addQry(instanceInfo, sql.getRepCode(), sql.getRepNo(), sql.getSql(), sql.getQrNo(), params);
		if (rn >= 0)
			sql.setRet("SUCCESS");
		else
			sql.setRet("ERROR");
		return new ResponseEntity<BatchSqlJson>(sql, HttpStatus.OK);
	}

	@RequestMapping(value = "/bat7SaveToTemp", method = RequestMethod.POST)
	public ResponseEntity<BatchSqlJson> bat7SaveRep(@RequestBody BatchSqlJson sql,
			@RequestParam Map<String, String> params) {
		boolean ret = repBat7.saveToTmp(instanceInfo, sql.getRepCode(), sql.getRepNo());
		if (ret) {
			sql.setRet("SUCCESS");
		} else
			sql.setRet("ERROR");
		return new ResponseEntity<BatchSqlJson>(sql, HttpStatus.OK);
	}

	@RequestMapping(value = "/bat7exeTime", method = RequestMethod.POST)
	public ResponseEntity<BatchSqlJson> bat7exeTime(@RequestBody BatchSqlJson sql,
			@RequestParam Map<String, String> params) {
		SimpleDateFormat sdf = new SimpleDateFormat(instanceInfo.getMmapVar().get("ENGLISH_DATE_FORMAT") + "HH:m:s");
		Date dt = repBat7.getExeTime(instanceInfo, sql.getRepCode(), sql.getRepNo());
		if (dt != null) {
			sql.setRet("SUCCESS");
			sql.setData(sdf.format(dt));
		} else
			sql.setRet("ERROR");
		return new ResponseEntity<BatchSqlJson>(sql, HttpStatus.OK);
	}

	@RequestMapping(value = "/bat7getPara", method = RequestMethod.POST)
	public ResponseEntity<BatchSqlJson> bat7getPara(@RequestBody BatchSqlJson sql,
			@RequestParam Map<String, String> params) {
		String ret = repBat7.getBatchParas(instanceInfo, sql.getRepCode(), sql.getRepNo());
		RepBatch7.UserReports ur = repBat7.getMapUserReports().get(instanceInfo.getmOwner() + "."
				+ instanceInfo.getmLoginUser() + "_" + sql.getRepCode() + "_" + sql.getRepNo());
		if (ret.equals("") || ret == null) {
			sql.setRet("ERROR");
			ret = "";
		} else
			sql.setRet("SUCCESS");
		sql.setData(ret);
		if (ur != null)
			sql.setWhereClause(ur.whereClause);

		return new ResponseEntity<BatchSqlJson>(sql, HttpStatus.OK);
	}

	@RequestMapping(value = "/bat7getData", method = RequestMethod.POST)
	public ResponseEntity<BatchSqlJson> bat7getData(@RequestBody BatchSqlJson sql,
			@RequestParam Map<String, String> params) {
		String ret = repBat7.getSqlData(instanceInfo, sql.getRepCode(), sql.getRepNo(), sql.getQrNo());
		SimpleDateFormat sdf = new SimpleDateFormat(instanceInfo.getMmapVar().get("ENGLISH_DATE_FORMAT") + " HH:m:s");
		if (ret.equals("") || ret == null) {
			sql.setRet("ERROR");
			ret = "";
		} else {
			sql.setRet("SUCCESS");
			Date dt = repBat7.getExeTime(instanceInfo, sql.getRepCode(), sql.getRepNo());
			sql.setP1(sdf.format(dt));
		}

		System.out.println("bat7getData =  repcode / " + sql.getRepCode() + " repNo / " + sql.getRepNo() + " qrno / "
				+ sql.getQrNo());
		sql.setData(ret);

		return new ResponseEntity<BatchSqlJson>(sql, HttpStatus.OK);
	}

	@RequestMapping(value = "/bat7exeRep", method = RequestMethod.POST)
	public ResponseEntity<BatchSqlJson> bat7exeRep(@RequestBody BatchSqlJson sql,
			@RequestParam Map<String, String> params) {
		RepBatch7.UserReports ur = repBat7.startThread(instanceInfo, sql.getRepCode(), sql.getRepNo());
		if (ur != null) {
			ur.reportTitle = sql.getP1();
			ur.cmd = sql.getP2();
			ur.whereClause = sql.getWhereClause();
		}

		sql.setRet("SUCCESS");
		System.out.println("bat7exeRep =  repcode / " + sql.getRepCode() + " repNo /" + sql.getRepNo());
		return new ResponseEntity<BatchSqlJson>(sql, HttpStatus.OK);
	}

	@RequestMapping(value = "/bat7ClrRep", method = RequestMethod.POST)
	public ResponseEntity<BatchSqlJson> bat7ClrRep(@RequestBody BatchSqlJson sql,
			@RequestParam Map<String, String> params) {

		if (sql.getP1().equals("true"))
			repBat7.saveToTmp(instanceInfo, sql.getRepCode(), sql.getRepNo());
		String ret = repBat7.clearReport(instanceInfo, sql.getRepCode(), sql.getRepNo());

		sql.setRet(ret);

		return new ResponseEntity<BatchSqlJson>(sql, HttpStatus.OK);
	}

	@RequestMapping(value = "/bat7getStat", method = RequestMethod.POST)
	public ResponseEntity<BatchSqlJson> bat7getStat(@RequestBody BatchSqlJson sql,
			@RequestParam Map<String, String> params) {
		String stat = repBat7.getStatus(instanceInfo, sql.getRepCode(), sql.getRepNo());
		if (stat == null || stat.equals(""))
			sql.setRet("ERROR");
		else
			sql.setRet("SUCCESS");
		sql.setData(stat);
		System.out.println("bat7getStat = " + stat + ", repcode / " + sql.getRepCode() + " repNo /" + sql.getRepNo());
		return new ResponseEntity<BatchSqlJson>(sql, HttpStatus.OK);
	}

	@RequestMapping(value = "/bat7exeimmediate", method = RequestMethod.POST)
	public ResponseEntity<BatchSqlJson> bat7exeim(@RequestBody BatchSqlJson sql,
			@RequestParam Map<String, String> params) {
		repBat7.addQry(instanceInfo, sql.getRepCode(), sql.getRepNo(), sql.getSql(), sql.getQrNo(), params);
		repBat7.startThread(instanceInfo, sql.getRepCode(), sql.getRepNo());

		try {
			Thread.sleep(100);
			System.out.println("Status : " + repBat7.getStatus(instanceInfo.getmOwner() + "."
					+ instanceInfo.getmLoginUser() + "_" + sql.getRepCode() + "_" + sql.getRepNo()));

			while (repBat7.getStatus(instanceInfo.getmOwner() + "." + instanceInfo.getmLoginUser() + "_"
					+ sql.getRepCode() + "_" + sql.getRepNo()).equals(UserReports.STATUS_START)) {
				System.out.println("sleep");
				Thread.sleep(500);
			}

			System.out.println("Data:");
			System.out.println(repBat7.getSqlData(instanceInfo, sql.getRepCode(), sql.getRepNo(), sql.getQrNo()));

		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		sql.setData(repBat7.getSqlData(instanceInfo, sql.getRepCode(), sql.getRepNo(), sql.getQrNo()));
		sql.setRet("SUCCESS");

		return new ResponseEntity<BatchSqlJson>(sql, HttpStatus.OK);
	}

	@RequestMapping(value = "/sqlmetadata", method = RequestMethod.POST)
	public ResponseEntity<SQLJson> testm(@RequestBody SQLJson sql, @RequestParam Map<String, String> params) {
		sql.setRet("ok");
		String retdata = "";
		Connection con = instanceInfo.getmDbc().getDbConnection();
		try {
			if (!instanceInfo.isMlogonSuccessed())
				throw new SQLException("Access denied !");

			// ResultSet rs = QueryExe.getSqlRS(sql.getSql(), con);
			retdata = executeSQlMetaData(sql.getSql(), params);
			// retdata = executeMetaData()//utils.getJSONsqlMetaData(rs, con,
			// "", "");
			sql.setData(retdata);
			sql.setRet("SUCCESS");
			con.commit();
		} catch (Exception e) {
			sql.setRet("server_error : " + e.getMessage());
			sql.setData("");
			e.printStackTrace();
			try {
				con.rollback();
			} catch (SQLException e1) {
			}
		}

		return new ResponseEntity<SQLJson>(sql, HttpStatus.OK);
	}

	@RequestMapping(value = "/gaugedata", method = RequestMethod.GET)
	public String gaugedata(@RequestParam Map<String, String> params) {
		SimpleDateFormat sdf = new SimpleDateFormat(instanceInfo.getMmapVar().get("ENGLISH_DATE_FORMAT") + "");
		String retdata = "";
		try {
			if (!instanceInfo.isMlogonSuccessed())
				throw new SQLException("Access denied !");

			String sq = "select *from C6_DB_GAUGES where profiles like '%\""
					+ instanceInfo.getMmapVar().get("PROFILENO") + "\"%' ORDER BY KEYFLD";
			Connection con = instanceInfo.getmDbc().getDbConnection();
			localTableModel lctb = new localTableModel();
			lctb.createDBClassFromConnection(con);
			lctb.executeQuery(sq, true);
			double val = 0;
			for (int i = 0; i < lctb.getRowCount(); i++) {
				String sqv = utils.nvl(lctb.getFieldValue(i, "SQL_VAL"), "");
				QueryExe qe = new QueryExe(sqv, con);
				for (String key : params.keySet()) {
					qe.setParaValue(key.replace("_para_", ""), params.get(key));
					if (params.get(key).startsWith("@"))
						qe.setParaValue(key.replace("_para_", ""), (sdf.parse(params.get(key).substring(1))));
				}
				ResultSet rs = qe.executeRS();
				if (rs != null) {
					rs.first();
					lctb.setFieldValue(i, "SQL_VAL", rs.getDouble(1));
					rs.close();
					qe.close();
				}

				if (!utils.nvl(lctb.getFieldValue(i, "PRIOR_FUNC_VAL"), "").isEmpty()) {
					sqv = utils.nvl(lctb.getFieldValue(i, "PRIOR_FUNC_VAL"), "");
					qe = new QueryExe(sqv, con);
					for (String key : params.keySet()) {
						qe.setParaValue(key.replace("_para_", ""), params.get(key));
						if (params.get(key).startsWith("@"))
							qe.setParaValue(key.replace("_para_", ""), (sdf.parse(params.get(key).substring(1))));
					}
					rs = qe.executeRS();
					if (rs != null) {
						rs.first();
						lctb.setFieldValue(i, "PRIOR_FUNC_VAL", rs.getDouble(1));
						rs.close();
						qe.close();
					}
				}
			}

			retdata = lctb.getJSONData();

		} catch (SQLException | ParseException e) {
			e.printStackTrace();
			retdata = "{\"errorMsg\":\"" + e.getMessage() + "\"} ";
		}

		return retdata;
	}

	@RequestMapping(value = "/gaugedata2", method = RequestMethod.GET)
	public String gaugedata2(@RequestParam Map<String, String> params) {
		SimpleDateFormat sdf = new SimpleDateFormat(instanceInfo.getMmapVar().get("ENGLISH_DATE_FORMAT") + "");
		String retdata = "";
		try {
			if (!instanceInfo.isMlogonSuccessed())
				throw new SQLException("Access denied !");
			String kf = params.get("_keyfld");
			String sq = "select *from C6_DB_GAUGES where keyfld=" + kf;
			Connection con = instanceInfo.getmDbc().getDbConnection();
			localTableModel lctb = new localTableModel();
			lctb.createDBClassFromConnection(con);
			lctb.executeQuery(sq, true);
			double val = 0;
			for (int i = 0; i < lctb.getRowCount(); i++) {
				String sqv = utils.nvl(lctb.getFieldValue(i, "SQL_VAL"), "");
				QueryExe qe = new QueryExe(sqv, con);
				for (String key : params.keySet()) {
					qe.setParaValue(key.replace("_para_", ""), params.get(key));
					if (params.get(key).startsWith("@"))
						qe.setParaValue(key.replace("_para_", ""), (sdf.parse(params.get(key).substring(1))));
				}

				ResultSet rs = qe.executeRS();
				if (rs != null) {
					rs.first();
					lctb.setFieldValue(i, "SQL_VAL", rs.getDouble(1));
					rs.close();
					qe.close();
				}

				if (!utils.nvl(lctb.getFieldValue(i, "PRIOR_FUNC_VAL"), "").isEmpty()) {
					sqv = utils.nvl(lctb.getFieldValue(i, "PRIOR_FUNC_VAL"), "");
					qe = new QueryExe(sqv, con);
					for (String key : params.keySet()) {
						qe.setParaValue(key.replace("_para_", ""), params.get(key));
						if (params.get(key).startsWith("@"))
							qe.setParaValue(key.replace("_para_", ""), (sdf.parse(params.get(key).substring(1))));
					}
					rs = qe.executeRS();
					if (rs != null) {
						rs.first();
						lctb.setFieldValue(i, "PRIOR_FUNC_VAL", rs.getDouble(1));
						rs.close();
						qe.close();
					}
				}
			}

			retdata = lctb.getJSONData();

		} catch (SQLException | ParseException e) {
			e.printStackTrace();
			retdata = "{\"errorMsg\":\"" + e.getMessage() + "\"} ";
		}

		return retdata;
	}

	@RequestMapping(value = "/sqlexe", method = RequestMethod.POST)
	public ResponseEntity<SQLJson> sqlExe(@RequestBody SQLJson sql) {
		sql.setRet("ok");
		String retdata = "";
		Connection con = instanceInfo.getmDbc().getDbConnection();
		try {

			con.setAutoCommit(false);
			System.out.println(sql.getSql());
			int x = QueryExe.execute(sql.getSql(), con);
			sql.setRet("SUCCESS");
			con.commit();
		} catch (SQLException e) {
			sql.setRet("server_error : " + e.getMessage());
			sql.setData("");
			e.printStackTrace();
			try {
				con.rollback();
			} catch (SQLException e1) {

			}
		}

		return new ResponseEntity<SQLJson>(sql, HttpStatus.OK);
	}

	@RequestMapping(value = "/report", method = RequestMethod.POST, produces = "application/pdf")
	public ResponseEntity<InputStreamResource> getReportPdf(@RequestParam Map<String, String> params) {
		String filename = servletContext.getRealPath("") + "reports/" + params.get("reportfile");

		byte[] pdfFile = null;
		try {
			pdfFile = getReport(params);
			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.parseMediaType("application/pdf"));
			headers.add("Access-Control-Allow-Origin", "*");
			headers.add("Access-Control-Allow-Methods", "GET, POST, PUT");
			headers.add("Access-Control-Allow-Headers", "Content-Type");
			headers.add("Content-Disposition", "filename=" + filename);
			headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
			headers.add("Pragma", "no-cache");
			headers.add("Expires", "0");
			ByteArrayInputStream bt = new ByteArrayInputStream(pdfFile);
			ResponseEntity<InputStreamResource> response = new ResponseEntity<InputStreamResource>(
					new InputStreamResource(bt), headers, HttpStatus.OK);
			return response;
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;

	}

	@RequestMapping(value = "/getAttachVou", method = RequestMethod.POST, produces = "application/pdf")
	public ResponseEntity<InputStreamResource> getAttachVou(@RequestParam Map<String, String> params) {
		String kf = params.get("keyfld");

		byte[] pdfFile = null;
		Connection con = instanceInfo.getmDbc().getDbConnection();
		try {
			PreparedStatement ps = con.prepareStatement("select pdf_data from c7_attach where keyfld=" + kf,
					ResultSet.TYPE_SCROLL_SENSITIVE, ResultSet.CONCUR_READ_ONLY);
			ResultSet rst = ps.executeQuery();
			if (rst.first()) {
				pdfFile = rst.getBytes(1);
			}
			rst.close();
			ps.close();
			if (pdfFile != null) {
				HttpHeaders headers = new HttpHeaders();
				headers.setContentType(MediaType.parseMediaType("application/pdf"));
				headers.add("Access-Control-Allow-Origin", "*");
				headers.add("Access-Control-Allow-Methods", "GET, POST, PUT");
				headers.add("Access-Control-Allow-Headers", "Content-Type");
				headers.add("Content-Disposition", "filename=file_" + kf + ".pdf");
				headers.add("Cache-Control", "no-cache, no-store, must-revalidate");
				headers.add("Pragma", "no-cache");
				headers.add("Expires", "0");
				ByteArrayInputStream bt = new ByteArrayInputStream(pdfFile);
				ResponseEntity<InputStreamResource> response = new ResponseEntity<InputStreamResource>(
						new InputStreamResource(bt), headers, HttpStatus.OK);
				return response;
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return null;

	}

	@PostMapping("/upload/report/pic")
	public ResponseEntity<?> uploadFileMulti(@RequestParam("extraField") String extraField,
			@RequestParam("files") MultipartFile[] uploadfiles) {

		// Get file name
		String uploadedFileName = Arrays.stream(uploadfiles).map(x -> x.getOriginalFilename())
				.filter(x -> !StringUtils.isEmpty(x)).collect(Collectors.joining(" , "));

		if (StringUtils.isEmpty(uploadedFileName)) {
			return new ResponseEntity("please select a file!", HttpStatus.OK);
		}

		try {

			saveUploadedFiles(Arrays.asList(uploadfiles));

		} catch (IOException e) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}

		return new ResponseEntity("Successfully uploaded - " + uploadedFileName, HttpStatus.OK);

	}

	@RequestMapping(value = "/uploadImage2", method = RequestMethod.POST)
	public @ResponseBody String uploadImage(@RequestParam Map<String, String> params, HttpServletRequest request) {
		String imageValue = params.get("imageValue");
		try {
			byte[] imageByte = Base64.decodeBase64(imageValue);
			String directory = servletContext.getRealPath("/") + "reports/sample.jpg";
			new FileOutputStream(directory).write(imageByte);
			return "success ";
		} catch (Exception e) {
			return "error = " + e;
		}

	}

	@RequestMapping("/uploadImageRep")
	public ResponseEntity<?> uploadImageRep(@RequestParam("data") MultipartFile avatar,
			@RequestParam("filename") String fn) {
		try {
			byte[] bytes = avatar.getBytes();
			String directory = servletContext.getRealPath("/") + "reports/" + fn + ".jpg";
			new FileOutputStream(directory).write(bytes);
			return new ResponseEntity("Successfully uploaded ", HttpStatus.OK);

		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;
	}

	@RequestMapping("/uploadAttachPdfVou")
	public ResponseEntity<?> uploadAttachPdfVou(@RequestParam("data") MultipartFile avatar,
			@RequestParam("keyfld") double kf, @RequestParam("descr") String descr) {
		Connection con = instanceInfo.getmDbc().getDbConnection();
		try {

			byte[] bytes = avatar.getBytes();
//			String directory = servletContext.getRealPath("/") + "reports/" + fn + ".jpg";
//			new FileOutputStream(directory).write(bytes);

			String sq = "begin delete from c7_attach where keyfld=?;"
					+ " INSERT INTO C7_ATTACH(KEYFLD,DESCR,PDF_DATA) VALUES (?,?,? );END;";
			if (bytes.length == 0) {
				sq = "begin delete from c7_attach where keyfld=?;end;";
				PreparedStatement ps = con.prepareStatement(sq);
				ps.setDouble(1, kf);
				ps.executeUpdate();
				ps.close();

			} else {
				con.setAutoCommit(false);
				PreparedStatement ps = con.prepareStatement(sq);

				ps.setDouble(1, kf);
				ps.setDouble(2, kf);
				ps.setString(3, descr);
				ps.setBytes(4, bytes);
				ps.executeUpdate();
				ps.close();
			}

			con.commit();

			return new ResponseEntity("Successfully uploaded ", HttpStatus.OK);

		} catch (Exception e) {
			// TODO Auto-generated catch block
			try {
				con.rollback();
			} catch (SQLException e1) {
				// TODO Auto-generated catch block
				e1.printStackTrace();
			}
			e.printStackTrace();
		}
		return null;
	}
	// ---------------all--helper-functions---

	private String getBatchStatus(Map<String, String> params) throws Exception {
		String ret = "";
		String rid = params.get("report-id");
		ret = "{}";
		String upath = instanceInfo.getmOwner() + "." + instanceInfo.getmLoginUser() + "_" + rid;
		if (batches.getMapUserReports().get(upath) != null)
			ret = utils.getJSONStr("status", batches.getMapUserReports().get(upath).status, true);
		else
			ret = utils.getJSONStr("status", "NONE", true);

		return ret;

	}

	private String getBatchParams(Map<String, String> params) throws Exception {
		String ret = "";
		String rid = params.get("report-id");
		ret = "{}";
		String upath = instanceInfo.getmOwner() + "." + instanceInfo.getmLoginUser() + "_" + rid;
		if (batches.getMapUserReports().get(upath) != null)
			ret = "{ \"parameters\" :{" + utils.getJSONMapString(batches.getMapUserReports().get(upath).params, false)
					+ "}}";
		else
			ret = utils.getJSONStr("errorMsg", "Not executed this report..", true);

		return ret;

	}

	private String getBatchData(Map<String, String> params) throws Exception {
		String ret = "";
		String rid = params.get("report-id");
		ret = "{}";
		String upath = instanceInfo.getmOwner() + "." + instanceInfo.getmLoginUser() + "_" + rid;
		if (batches.getMapUserReports().get(upath) != null)
			ret = batches.getMapUserReports().get(upath).getReturnString();
		else
			ret = "{}";

		return ret;

	}

	private String quickRepData(Map<String, String> params) throws Exception {
		String ret = "";
		String rid = params.get("report-id");
		ret = "{}";
		String rb = utils.nvl(params.get("runbackground"), "false");

//		if (!rb.equals("true")) {
//			int n = batches.addBatch(rid, instanceInfo, params, true);
//			ret = batches.getListUserReports().get(n).getReturnString();
//		} else {
//			ret=quickRepDataAsync(params);
//		}

		int n = batches.addBatch(rid, instanceInfo, params, true);

		if (!rb.equals("true")) {
			while (batches.getListUserReports().get(n).status.equals(UserReports.STATUS_START)) {
				try {
					Thread.sleep(500);
				} catch (InterruptedException e) {
					System.out.println(e);
				}
			}
			ret = batches.getListUserReports().get(n).getReturnString();
		}

		return ret;

	}
//	@Async
//	public CompletableFuture<String> quickRepDataAsync(Map<String,String> params){
//		String ret=
//		return CompletableFuture<String>
//	}

	private String buildSql(Map<String, String> params) {
		List<String> cols = new ArrayList<String>();
		List<String> wc = new ArrayList<String>();
		List<String> ordby = new ArrayList<String>();

		for (String key : params.keySet()) {
			if (key.startsWith("col-"))
				cols.add(params.get(key));
			if (key.startsWith("ordby1-"))
				ordby.add(params.get(key) + " ASC");
			if (key.startsWith("ordby2-"))
				ordby.add(params.get(key) + " DESC");
			if (key.startsWith("and-equal-"))
				wc.add(key.replace("and-equal-", "") + "='" + params.get(key) + "'");
		}

		String tn = params.get("tablename");

		String c = "", w = "", o = "", sql = "";

		for (String v : ordby)
			o += (o.length() == 0 ? "" : ",") + v;
		for (String v : cols)
			c += (c.length() == 0 ? "" : ",") + v;
		for (String v : wc)
			w += (w.length() == 0 ? "" : " and ") + v;

		sql = "select " + (c.length() == 0 ? " * from " : " " + c + " from ") + tn + " "
				+ (w.length() == 0 ? "" : " where " + w) + (o.length() == 0 ? "" : " order by " + o);

		return sql;
	}

	private String getInitFiles(Map<String, String> params) {
		String ret = "";
		String fn = "";
		File dir = new File(path);
		for (File file : dir.listFiles()) {
			if (file.getName().endsWith((".ini")))
				fn += (fn.length() > 0 ? "," : "") + "{ \"file\" :" + "\"" + file.getName() + "\" }";
		}

		ret = "[" + fn + "]";

		return ret;
	}

	private String getFiscalData(Map<String, String> params) {
		String ret = "";
		ret = utils.getJSONStr("fiscal_code", instanceInfo.getmFiscalCode(), false);
		ret += "," + utils.getJSONStr("fiscal_title", instanceInfo.getmFiscalTit(), false);
		ret += "," + utils.getJSONStr("fiscal_from", instanceInfo.getmFiscalFrom(), false);
		ret += "," + utils.getJSONStr("fiscal_to", instanceInfo.getmFiscalTo(), false);

		return "{" + ret + "}";
	}

	private String getInitFileData(Map<String, String> params) {
		String ret = "";
		String fn = "";
		String fnm = params.get("file");
		String line;
		String ss = "";
		if (fnm == null || fnm == "")
			return "";

		try {
			File file = new File(path + fnm);
			FileReader fr;
			fr = new FileReader(file);
			BufferedReader br = new BufferedReader(fr); // creates a buffering character input stream
			while ((line = br.readLine()) != null) {
				String[] s2 = line.split("=");
				if (s2.length > 1)
					ss += ((ss.length() > 0) ? "," : "") + utils.getJSONStr(s2[0], s2[1], false);
			}
			fr.close();
		} catch (Exception e) {
			e.printStackTrace();
			return utils.getJSONStr("errorMsg", "File not found", true);
		}

		return "{" + ss + "}";
	}

	private String buildJsonGraphQuery(Map<String, String> params) throws Exception {
		Connection con = instanceInfo.getmDbc().getDbConnection();
		SimpleDateFormat sdf = new SimpleDateFormat(instanceInfo.getMmapVar().get("ENGLISH_DATE_FORMAT") + "");
		localTableModel lctb = new localTableModel();
		String _balfld = "";
		String _fld = "";
		String ret = "";
		String bgn = " c6_session.username:='" + instanceInfo.getmLoginUser() + "'; c6_session.session_id:='"
				+ instanceInfo.sessionId + "';";

		String sql = (QueryExe.getSqlValue("select sql from c6_subreps where keyfld=" + params.get("_keyfld"), con, "")
				+ "").trim();
		String b4_sql = QueryExe.getSqlValue(
				"select BEFORE_SQL_EXE from c6_subreps where keyfld=" + params.get("_keyfld"), con, "") + "";
		String b4_sql_once = QueryExe.getSqlValue(
				"select BEFORE_SQL_EXE_ONCE from c6_subreps where keyfld=" + params.get("_keyfld"), con, "") + "";
		try {

			ResultSet rs = QueryExe.getSqlRS("select *from c6_subreps where keyfld=" + params.get("_keyfld"), con);
			if (rs != null)
				rs.first();
			if (rs.getString("REP_TYPE").equals("QUERY")) {
				params.put("report-id", rs.getString("SQL"));
				ResultSet rs2 = QueryExe.getSqlRS(
						"select field_name from c6_qry2 where code='" + rs.getString("SQL") + "' order by INDEXNO",
						con);
				int ii = 0;
				if (rs2 != null) {
					rs2.beforeFirst();
					while (rs2.next()) {
						params.put("col_" + ii++, rs2.getString("FIELD_NAME"));
					}
					rs2.close();
				}
				ret = quickRepData(params);
				rs.getStatement().close();
				rs.close();
				return ret;
			}

			if (sql.isEmpty() || !sql.toUpperCase().startsWith("SELECT"))
				return "";

			// getting all fields in list from first row
			List<String> lstf = new ArrayList<String>();
			lstf.add("rn");
			String flds = "rn";
			int fn = Integer.valueOf(params.get("_total_no"));
			if (fn > 0)
				for (String key : params.keySet()) {
					if (key.startsWith("_flds_0_")) {
						lstf.add(key.replace("_flds_0_", ""));
						flds += (flds.isEmpty() ? "" : ",") + " '' " + key.replace("_flds_0_", "");
					}
				}

			QueryExe qep = null;
			QueryExe qepo = null;
			if (!b4_sql.isEmpty()) {

				qep = new QueryExe(con);
				qep.setSqlStr(utils.insertStringAfter(b4_sql, bgn, "begin"));
				qep.parse();
			}
			if (!b4_sql_once.isEmpty()) {
				qepo = new QueryExe(con);
				qepo.setSqlStr(utils.insertStringAfter(b4_sql_once, bgn, "begin"));
				qepo.parse();
			}

			QueryExe qe = new QueryExe(con);
			qe.setSqlStr(sql);
			System.out.println("About to execute : " + sql);
			qe.parse();

			for (int i = 0; i < fn; i++) {

				for (String key : params.keySet()) {

					qe.setParaValue(key.replace("_para_", ""), params.get(key));
					if (qep != null)
						qep.setParaValue(key.replace("_para_", ""), params.get(key));

					if (params.get(key).startsWith("@"))
						qe.setParaValue(key.replace("_para_", ""), (sdf.parse(params.get(key).substring(1))));
					if (qep != null && params.get(key).startsWith("@"))
						qep.setParaValue(key.replace("_para_", ""), (sdf.parse(params.get(key).substring(1))));

					if (!b4_sql_once.isEmpty() && i == 0) {
						qepo.setParaValue(key.replace("_para_", ""), params.get(key));
						if (params.get(key).startsWith("@"))
							qepo.setParaValue(key.replace("_para_", ""), (sdf.parse(params.get(key).substring(1))));
					}
				}
				for (String l : lstf) {
					String p = params.get("_flds_" + i + "_" + l);
					if (p != null && !p.isEmpty()) {
						qe.setParaValue(l.replaceAll(" ", "_"), p);
						if (qep != null)
							qep.setParaValue(l.replaceAll(" ", "_"), p);

						if (p.startsWith("@"))
							qe.setParaValue(l.replaceAll(" ", "_"), (sdf.parse(p.substring(1))));
						if (qep != null && p.startsWith("@"))
							qep.setParaValue(l.replaceAll(" ", "_"), (sdf.parse(p.substring(1))));

						if (!b4_sql_once.isEmpty() && i == 0) {
							qep.setParaValue(l.replaceAll(" ", "_"), p);
							if (p.startsWith("@"))
								qepo.setParaValue(l.replaceAll(" ", "_"), (sdf.parse(p.substring(1))));
						}

					}
				}

				if (qep != null)
					qep.execute(true);

				if (qepo != null && i == 0)
					qepo.execute();
				rs = qe.executeRS(true);
				if (rs == null)
					continue;
				ResultSetMetaData rsm = rs.getMetaData();
				lctb.fetchData(rs, (i != 0));
				rs.close();
				qe.close();
			}
			if (qepo != null)
				qepo.close();
			if (qep != null)
				qep.close();

			con.commit();
		} catch (SQLException ex) {
			ex.printStackTrace();
			con.rollback();
			throw ex;
		}

		ResultSet rs = QueryExe.getSqlRS("select *from c6_subreps where keyfld=" + params.get("_keyfld"), con);
		if (rs != null) {
			rs.first();
			if (rs.getString("REP_TYPE").equals("TABLE")) {
				if (!utils.nvl(rs.getString("groups"), "").isEmpty()) {
					String[] sp = utils.nvl(rs.getString("groups"), "").split(",");
					for (String s : sp) {
						qryColumn qc = lctb.getColByName(s);
						lctb.applyDefaultCP(qc);
						qc.columnUIProperties.isGrouped = true;
					}
				}
				if (!utils.nvl(rs.getString("hidden_fields"), "").isEmpty()) {
					String[] sp = utils.nvl(rs.getString("hidden_fields"), "").split(",");
					for (String s : sp) {
						qryColumn qc = lctb.getColByName(s);
						lctb.applyDefaultCP(qc);
						qc.columnUIProperties.hide_col = true;
					}
				}
				if (!utils.nvl(rs.getString("sum_fields"), "").isEmpty()) {
					String[] sp = utils.nvl(rs.getString("sum_fields"), "").split(",");
					for (String s : sp) {
						qryColumn qc = lctb.getColByName(s);
						lctb.applyDefaultCP(qc);
						qc.columnUIProperties.summary = "SUM";
					}
				}
				if (!utils.nvl(rs.getString("WIDTH_FIELDS"), "").isEmpty()) {
					String[] sp = utils.nvl(rs.getString("WIDTH_FIELDS"), "").split(",");
					for (String s : sp) {
						String[] ss = s.split("=");
						qryColumn qc = lctb.getColByName(ss[0]);
						lctb.applyDefaultCP(qc);
						qc.columnUIProperties.display_width = Integer.valueOf(ss[1]);
					}
				}
				if (!utils.nvl(rs.getString("FORMAT_FIELDS"), "").isEmpty()) {
					String[] sp = utils.nvl(rs.getString("FORMAT_FIELDS"), "").split(",");
					for (String s : sp) {
						String[] ss = s.split("=");
						qryColumn qc = lctb.getColByName(ss[0]);
						if (qc != null)
							lctb.applyDefaultCP(qc);
						qc.columnUIProperties.display_format = ss[1];
					}
				}

			}

			rs.getStatement().close();
			rs.close();

		}

		for (int i = 0; i < lctb.getVisbleQrycols().size(); i++) {
			qryColumn qc = lctb.getVisbleQrycols().get(i);
			if (qc.isNumber() && qc.getColname().endsWith("_BAL")) {
				_balfld = qc.getColname();
				_fld = qc.getColname().replace("_BAL", "");
			}
		}

		if (lctb.getQrycols().size() > 0 && !_balfld.isEmpty()) {
			String firstFld = lctb.getColByPos(0).getColname();
			String firstColVal = "";
			double _bal = 0, tmp = 0;
			for (int i = 0; i < lctb.getRowCount(); i++) {
				if (i == 0)
					firstColVal = utils.nvl(lctb.getFieldValue(i, firstFld), "");
				if (firstColVal.equals(lctb.getFieldValue(i, firstFld))) {
					_bal += ((Number) lctb.getFieldValue(i, _fld)).doubleValue();
					lctb.setFieldValue(i, _balfld, _bal);
				} else {
					_bal = ((Number) lctb.getFieldValue(i, _fld)).doubleValue();
					lctb.setFieldValue(i, _balfld, _bal);
					firstColVal = utils.nvl(lctb.getFieldValue(i, firstFld), "");
				}

			}
		}

		lctb.setShortDateFormat(instanceInfo.getMmapVar().get("ENGLISH_DATE_FORMAT") + "");
		ret = lctb.getJSONData();
		System.gc();
		return ret;
	}

	private byte[] getReport(Map<String, String> params) throws Exception {
		Map<String, Object> mp = new HashMap<String, Object>();
		SimpleDateFormat sdf = new SimpleDateFormat(instanceInfo.getMmapVar().get("ENGLISH_DATE_FORMAT") + "");
		String reportfile = params.get("reportfile");
		for (String key : params.keySet()) {
			if (key.contains("_para_")) {
				mp.put(key.replace("_para_", ""), params.get(key));
				if (params.get(key).startsWith("@"))
					mp.put(key.replace("_para_", ""), (sdf.parse(params.get(key).substring(1))));
			}
		}
		mp.put("COMPANY_NAME", instanceInfo.getMmapVar().get("COMPANY_NAME"));
		mp.put("COMPANY_NAMEA", instanceInfo.getMmapVar().get("COMPANY_NAMEA"));
		mp.put("COMPANY_SPECS", instanceInfo.getMmapVar().get("COMPANY_SPECS"));
		mp.put("COMPANY_SPECSA", instanceInfo.getMmapVar().get("COMPANY_SPECSA"));
		mp.put("COMPANY_LOGO", instanceInfo.getMmapVar().get("COMPANY_LOGO"));
		mp.put("CURRENCY_FORMAT", instanceInfo.getMmapVar().get("FORMAT_MONEY_1"));
		mp.put("DATE_FORMAT", instanceInfo.getMmapVar().get("ENGLISH_DATE_FORMAT"));
		mp.put("SES_ID", instanceInfo.getMmapVar().get("SESSION_ID"));
		// mp.forEach((key, value) -> System.out.println(key + ":" + value));
		byte[] pdfFile = instanceInfo.storeReport(reportfile, mp, false);
		return pdfFile;

	}

	// save file
	private void saveUploadedFiles(List<MultipartFile> files) throws IOException {

		for (MultipartFile file : files) {

			if (file.isEmpty()) {
				continue; // next pls
			}

			byte[] bytes = file.getBytes();
			Path path = Paths.get(servletContext.getRealPath("") + "report/tmp/" + file.getOriginalFilename());
			Files.write(path, bytes);

		}

	}

	private String executeSQlMetaData(String sql, Map<String, String> params) throws Exception {
		SimpleDateFormat sdf = new SimpleDateFormat(instanceInfo.getMmapVar().get("ENGLISH_DATE_FORMAT") + "");
		Connection con = instanceInfo.getmDbc().getDbConnection();
		String bgn = " c6_session.username:='" + instanceInfo.getmLoginUser() + "'; c6_session.session_id:='"
				+ instanceInfo.sessionId + "';";

		String ssql = sql;
		if (!sql.toUpperCase().startsWith("SELECT")) {
			ssql = utils.insertStringAfter(sql, bgn, "BEGIN");
		}

		QueryExe qe = new QueryExe(ssql, con);
		for (String key : params.keySet()) {
			String p = params.get(key);
			String k = key.replaceAll(" ", "_").replaceAll("_para_", "");
			if (k != null && !k.isEmpty()) {
				qe.setParaValue(k, p);
				if (p.startsWith("@"))
					qe.setParaValue(k, (sdf.parse(p.substring(1))));
			}
		}
		ResultSet rs = null;
		String ret = "";

		if (ssql.toUpperCase().startsWith("SELECT")) {
//			System.out.println(ssql);
			rs = qe.executeRS();
			this.lastRsSave = rs;
			ret = utils.getJSONsqlMetaData(rs, con, "", "");
			if (params.get("saveQryName") != null) {
				saveTempQry(rs, params.get("saveQryName"));
			}
		} else {
			qe.execute();
		}

		qe.close();
		if (rs != null) {
			if (rs.getStatement() != null)
				rs.getStatement().close();
			rs.close();
		}
		return ret;
	}

	private void saveTempQry(ResultSet rs, String nm) {
		String sq = "begin delete from temporary where idno=878787 and usernm='" + instanceInfo.sessionId + "_" + nm
				+ "';";
		String sq1 = " insert into temporary (idno,usernm,";
		String cols = "";
		String vals = "";
		String plsql = "";

		try {
			ResultSetMetaData rsm = rs.getMetaData();
			for (int i = 0; i < rsm.getColumnCount(); i++)
				cols += (cols.length() > 0 ? "," : "") + "field" + (i + 1);

			rs.beforeFirst();
			while (rs.next()) {
				vals = "878787,'" + instanceInfo.sessionId + "_" + nm + "'";
				for (int i = 0; i < rsm.getColumnCount(); i++)
					vals += (vals.length() > 0 ? "," : "") + "'" + rs.getString(i + 1) + "'";
				plsql += sq1 + cols + ") values (" + vals + ");";
			}
			plsql = sq + plsql + " end; ";
			this.saveQryPlsql = plsql;
			System.out.println(this.saveQryPlsql);

		} catch (SQLException e) {
			e.printStackTrace();
		}

//		if (this.saveQryTimer!=null) {
		this.saveQryTimer.cancel();
		this.saveQryTimer.purge();

//		}

		TimerTask tt = new TimerTask() {

			@Override
			public void run() {
				try {
					System.out.println("Saving qry " + nm);
					QueryExe.execute(UserRoute.this.saveQryPlsql, instanceInfo.getmDbc().getDbConnection());
					instanceInfo.getmDbc().getDbConnection().commit();
					System.out.println("End Saving qry " + nm);
					UserRoute.this.lastRsSave = null;
					Timer tm = new Timer(true);
					String removingSql = "delete from temporary where idno=878787 and usernm='" + instanceInfo.sessionId
							+ "_" + nm + "'";
					tm.schedule(new TimerTask() {

						@Override
						public void run() {
							try {

								QueryExe.execute(removingSql, instanceInfo.getmDbc().getDbConnection());
								instanceInfo.getmDbc().getDbConnection().commit();
								System.out.println("Removing saved query " + nm);
							} catch (SQLException e) {
								e.printStackTrace();
							}

						}
					}, 600 * 1000);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		};

		this.saveQryTimer = new Timer(true);
		this.saveQryTimer.schedule(tt, 1 * 1000);
		System.gc();
	}

	private String getSubRepJson(String repname, String id) throws Exception {
		String ret = "";
		Connection con = instanceInfo.getmDbc().getDbConnection();
		ResultSet rs = QueryExe.getSqlRS("select *from c6_subreps where (rep_id like '%\"" + id + "\"%' or rep_id='"
				+ id + "' ) order by rep_pos", con);
		String subreps = "";
		if (rs != null && rs.first()) {
			subreps = utils.getJSONsql(repname, rs, con, "", "");
			rs.close();
		}
		ret = subreps;
		return ret;
	}

}
