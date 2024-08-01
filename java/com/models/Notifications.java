package com.models;

import java.io.File;
import java.math.BigInteger;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Component;

import com.controller.InstanceInfo;
import com.generic.DBClass;
import com.generic.Parameter;
import com.generic.QueryExe;
import com.generic.localTableModel;
import com.generic.utils;

public class Notifications {

	Map<String, UserNotifications> mapUN = new HashMap<String, UserNotifications>();
	private static int countRun = 0;
	private static Map<String, String> mapFiles = new HashMap<String, String>();
	private static int totalthread = 0;

	@Component
	public class UserNotifications extends Thread {
		public InstanceInfo instanceInfo = null;
		private localTableModel mLctb = new localTableModel();
		private Map<String, Object> mMapVars = new HashMap<String, Object>();
		private String mOwner = "";
		private String mOwnerPassword = "";
		private String mOwnerDBUrl = "";
		private String mRunNotification = "N";

		private String mLoginFile = "";
		private DBClass mDbc = null;
		private Date lastSetupData = null;
		private boolean stopThisThread = false;
		private localTableModel logTb = new localTableModel();

		public UserNotifications(String initFile) {
			this.mLoginFile = initFile;
			if (mapFiles.get(initFile) != null) {
				stopThisThread = true;
				return;
			}
			try {
				utils.readVars(mMapVars, mLoginFile);
				mOwner = mMapVars.get("ini_owner") + "";
				mOwnerPassword = mMapVars.get("ini_password") + "";
				mOwnerDBUrl = mMapVars.get("ini_dburl") + "";
				mRunNotification = utils.nvl(mMapVars.get("ini_notify"), "N") + "";
				if (!mRunNotification.equals("Y")) {
					return;
				}
//				System.out.println("Running notification loop for " + mOwner);
				totalthread++;
				mapFiles.put(mLoginFile, "ok");
				System.out.println("Loading .." + totalthread + "  ..." + mLoginFile);
				mDbc = new DBClass(mOwnerDBUrl, mOwner, mOwnerPassword);
				mLctb.createDBClassFromConnection(this.mDbc.getDbConnection());
				logTb.createDBClassFromConnection(this.mDbc.getDbConnection());
			} catch (Exception e) {
				e.printStackTrace();
			}

		}

		@Override
		public void run() {
			if (stopThisThread)
				return;
			if (countRun > totalthread)
				return;

			String sq1 = "select *from c7_logs where LOGGED_TIME>?" + " order by keyfld";
			if (!mRunNotification.equals("Y"))
				return;

			try {
				logTb.parseSQL(sq1);
			} catch (SQLException ex) {
				ex.printStackTrace();
				return;
			}
			countRun++;
			System.out.println("Running new thread ... " + new Date(System.currentTimeMillis()));
			while (1 == 1) {
				try {
					if (stopThisThread)
						return;
					Thread.sleep(30000);
//					System.out.println("Running notification loop for " + this.mLoginFile);
					this.refreshSetupData();
					if (this.mLctb.getRowCount() <= 0)
						continue;
					Timestamp low = new Timestamp(((Date) this.mLctb.getFieldValue(0, "LAST_NOTIFIED_TIME")).getTime());
					for (int i = 0; i < this.mLctb.getRowCount(); i++) {
						Timestamp ln = new Timestamp(
								((Date) this.mLctb.getFieldValue(i, "LAST_NOTIFIED_TIME")).getTime());
						if (ln.after(low))
							low.setTime(ln.getTime());
					}

					logTb.getDbclass().getStatment().setTimestamp(1, low);
					logTb.executeQuery(sq1, true, true);
					if (logTb.getRowCount() <= 0)
						continue;
					this.mDbc.getDbConnection().setAutoCommit(false);
					for (int i = 0; i < this.mLctb.getRowCount(); i++) {
						String st = this.mLctb.getFieldValue(i, "SETUP_TYPE").toString();
						generateNotify(i, st, logTb);
//						if (st.startsWith("ACACCOUNT")) {
//							_checkAccount(i, logTb);
//						}
//						if (st.startsWith("JV")) {
//							_checkNewJV(i, st, logTb);
//						}
						this.mDbc.getDbConnection().commit();
						Thread.sleep(1000);
					}

				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}

			}

		}

		public void generateNotify(int i, String st, localTableModel logTb) throws Exception {
			String un = this.mLctb.getFieldValue(i, "USERNM").toString();
			String kf = this.mLctb.getFieldValue(i, "KEYFLD").toString();
			String cs = this.mLctb.getFieldValue(i, "CONDITION_STR").toString();
			String cmd = this.mLctb.getFieldValue(i, "CMD").toString();
			String dclk = this.mLctb.getFieldValue(i, "DEL_ON_CLICK").toString();
			String descr = this.mLctb.getFieldValue(i, "DESCR_STR").toString();
			String descra = this.mLctb.getFieldValue(i, "DESCR_STRA").toString();
			String tit = this.mLctb.getFieldValue(i, "TITLE_STR").toString();
			String tita = this.mLctb.getFieldValue(i, "TITLE_STRA").toString();

			Timestamp ln = new Timestamp(((Date) this.mLctb.getFieldValue(i, "LAST_NOTIFIED_TIME")).getTime());
			double firstid = -1;
			for (int j = 0; j < logTb.getRowCount(); j++) {
				double logkf = Double.parseDouble(logTb.getFieldValue(j, "KEYFLD").toString());
				String notifyType = logTb.getFieldValue(j, "NOTIFY_TYPE").toString();
				String transType = logTb.getFieldValue(j, "TRANS_TYPE").toString();
				String usernm = logTb.getFieldValue(j, "USERNM").toString();
				String tableName = logTb.getFieldValue(j, "TABLE_NAME").toString();
				String valPara1 = logTb.getFieldValue(j, "VAL_PARA_1").toString();
				String valPara2 = logTb.getFieldValue(j, "VAL_PARA_2").toString();
				String valPara3 = logTb.getFieldValue(j, "VAL_PARA_3").toString();
				String valPara4 = logTb.getFieldValue(j, "VAL_PARA_4").toString();
				String valPara5 = logTb.getFieldValue(j, "VAL_PARA_5").toString();

				Timestamp loggedTime = new Timestamp(((Date) logTb.getFieldValue(j, "LOGGED_TIME")).getTime());

				String cmdx = cmd.replaceAll("VAR_PARA_1", valPara1).replaceAll("VAR_PARA_2", valPara2)
						.replaceAll("VAR_PARA_3", valPara3).replaceAll("VAR_PARA_4", valPara4)
						.replaceAll("VAR_PARA_5", valPara5);
				;

				String titx = tit.replaceAll("VAR_PARA_1", valPara1).replaceAll("VAR_PARA_2", valPara2)
						.replaceAll("VAR_PARA_3", valPara3).replaceAll("VAR_PARA_4", valPara4)
						.replaceAll("VAR_PARA_5", valPara5);
				;

				String titax = tita.replaceAll("VAR_PARA_1", valPara1).replaceAll("VAR_PARA_2", valPara2)
						.replaceAll("VAR_PARA_3", valPara3).replaceAll("VAR_PARA_4", valPara4)
						.replaceAll("VAR_PARA_5", valPara5);
				;

				String descrx = descr.replaceAll("VAR_PARA_1", valPara1).replaceAll("VAR_PARA_2", valPara2)
						.replaceAll("VAR_PARA_3", valPara3).replaceAll("VAR_PARA_4", valPara4)
						.replaceAll("VAR_PARA_5", valPara5);
				;

				String descrax = descra.replaceAll("VAR_PARA_1", valPara1).replaceAll("VAR_PARA_2", valPara2)
						.replaceAll("VAR_PARA_3", valPara3).replaceAll("VAR_PARA_4", valPara4)
						.replaceAll("VAR_PARA_5", valPara5);
				;

				// new jv

				if (((firstid != -1 && logkf > firstid) || loggedTime.after(ln)) && st.equals(notifyType)
						&& valPara2.equals(cs)) {
					ln.setTime(loggedTime.getTime());
					String d1 = utils.nvl(descrx,
							"USER #" + usernm + ", " + notifyType + "  # " + valPara2 + " !, time : " + ln);
					utils.insertNotify(this.mDbc.getDbConnection(), un, notifyType, d1, cmdx, usernm, dclk, titx, titax,
							descrax);
					this.mLctb.setFieldValue(i, "LAST_NOTIFIED_TIME", ln);
					QueryExe.execute("update c7_notify_setup set LAST_NOTIFIED_TIME=:LN where keyfld=" + kf,
							this.mDbc.getDbConnection(), new Parameter("LN", ln));
					firstid = logkf;
				} else
					firstid = -1;
			}

		}

		public void _checkNewJV(int i, String st, localTableModel logTb) throws Exception {
			String un = this.mLctb.getFieldValue(i, "USERNM").toString();
			String kf = this.mLctb.getFieldValue(i, "KEYFLD").toString();
			String cs = this.mLctb.getFieldValue(i, "CONDITION_STR").toString();
			String cmd = this.mLctb.getFieldValue(i, "CMD").toString();
			String dclk = this.mLctb.getFieldValue(i, "DEL_ON_CLICK").toString();
			String descr = this.mLctb.getFieldValue(i, "DESCR_STR").toString();
			String descra = this.mLctb.getFieldValue(i, "DESCR_STRA").toString();
			String tit = this.mLctb.getFieldValue(i, "TITLE_STR").toString();
			String tita = this.mLctb.getFieldValue(i, "TITLE_STRA").toString();

			Timestamp ln = new Timestamp(((Date) this.mLctb.getFieldValue(i, "LAST_NOTIFIED_TIME")).getTime());

			for (int j = 0; j < logTb.getRowCount(); j++) {
				String transType = logTb.getFieldValue(j, "TRANS_TYPE").toString();
				String usernm = logTb.getFieldValue(j, "USERNM").toString();
				String tableName = logTb.getFieldValue(j, "TABLE_NAME").toString();
				String valPara1 = logTb.getFieldValue(j, "VAL_PARA_1").toString();
				String valPara2 = logTb.getFieldValue(j, "VAL_PARA_2").toString();
				String valPara3 = logTb.getFieldValue(j, "VAL_PARA_3").toString();
				String valPara4 = logTb.getFieldValue(j, "VAL_PARA_4").toString();
				String valPara5 = logTb.getFieldValue(j, "VAL_PARA_5").toString();

				Timestamp loggedTime = new Timestamp(((Date) logTb.getFieldValue(j, "LOGGED_TIME")).getTime());

				String cmdx = cmd.replaceAll("VAR_PARA_1", valPara1).replaceAll("VAR_PARA_2", valPara2)
						.replaceAll("VAR_PARA_3", valPara3).replaceAll("VAR_PARA_4", valPara4)
						.replaceAll("VAR_PARA_5", valPara5);

				String titx = tit.replaceAll("VAR_PARA_1", valPara1).replaceAll("VAR_PARA_2", valPara2)
						.replaceAll("VAR_PARA_3", valPara3).replaceAll("VAR_PARA_4", valPara4)
						.replaceAll("VAR_PARA_5", valPara5);

				String titax = tita.replaceAll("VAR_PARA_1", valPara1).replaceAll("VAR_PARA_2", valPara2)
						.replaceAll("VAR_PARA_3", valPara3).replaceAll("VAR_PARA_4", valPara4)
						.replaceAll("VAR_PARA_5", valPara5);

				String descrx = descr.replaceAll("VAR_PARA_1", valPara1).replaceAll("VAR_PARA_2", valPara2)
						.replaceAll("VAR_PARA_3", valPara3).replaceAll("VAR_PARA_4", valPara4)
						.replaceAll("VAR_PARA_5", valPara5);

				String descrax = descra.replaceAll("VAR_PARA_1", valPara1).replaceAll("VAR_PARA_2", valPara2)
						.replaceAll("VAR_PARA_3", valPara3).replaceAll("VAR_PARA_4", valPara4)
						.replaceAll("VAR_PARA_5", valPara5);

				// new jv
				if (loggedTime.after(ln) && st.equals("JV_NEW") && tableName.equals("ACVOUCHER1")
						&& transType.equals("INSERT") && valPara2.equals(cs)) {
					ln.setTime(loggedTime.getTime());
					String d1 = utils.nvl(descrx, "USER #" + usernm + ", NEW JV # " + valPara3 + " !, time : " + ln);
					utils.insertNotify(this.mDbc.getDbConnection(), un, "JV_NEW", d1, cmdx, usernm, dclk, titx, titax,
							descrax);
					this.mLctb.setFieldValue(i, "LAST_NOTIFIED_TIME", ln);
					QueryExe.execute("update c7_notify_setup set LAST_NOTIFIED_TIME=:LN where keyfld=" + kf,
							this.mDbc.getDbConnection(), new Parameter("LN", ln));

				}
				// posted jv
				if (loggedTime.after(ln) && st.equals("JV_POSTED") && tableName.equals("ACVOUCHER1")
						&& transType.equals("POSTED") && valPara1.equals(cs)) {
					ln.setTime(loggedTime.getTime());
					String d1 = utils.nvl(descrx, "USER #" + usernm + ", POSTED JV # " + valPara3 + " !, time : " + ln);
					utils.insertNotify(this.mDbc.getDbConnection(), un, "JV_POSTED", d1, "", usernm, dclk, titx, titax,
							descrax);
					this.mLctb.setFieldValue(i, "LAST_NOTIFIED_TIME", ln);
					QueryExe.execute("update c7_notify_setup set LAST_NOTIFIED_TIME=:LN where keyfld=" + kf,
							this.mDbc.getDbConnection(), new Parameter("LN", ln));

				}

			}

		}

		public void _checkAccount(int i, localTableModel logTb) throws Exception {
			String un = this.mLctb.getFieldValue(i, "USERNM").toString();
			String kf = this.mLctb.getFieldValue(i, "KEYFLD").toString();
			String cs = this.mLctb.getFieldValue(i, "CONDITION_STR").toString();
			String cmd = this.mLctb.getFieldValue(i, "CMD").toString();
			String dclk = this.mLctb.getFieldValue(i, "DEL_ON_CLICK").toString();
			String descr = this.mLctb.getFieldValue(i, "DESCR_STR").toString();
			String descra = this.mLctb.getFieldValue(i, "DESCR_STRA").toString();
			String tit = this.mLctb.getFieldValue(i, "TITLE_STR").toString();
			String tita = this.mLctb.getFieldValue(i, "TITLE_STRA").toString();

			Timestamp ln = new Timestamp(((Date) this.mLctb.getFieldValue(i, "LAST_NOTIFIED_TIME")).getTime());

			for (int j = 0; j < logTb.getRowCount(); j++) {
				String transType = logTb.getFieldValue(j, "TRANS_TYPE").toString();
				String usernm = logTb.getFieldValue(j, "USERNM").toString();
				String tableName = logTb.getFieldValue(j, "TABLE_NAME").toString();
				String valPara1 = logTb.getFieldValue(j, "VAL_PARA_1").toString();
				String valPara2 = logTb.getFieldValue(j, "VAL_PARA_2").toString();
				String valPara3 = logTb.getFieldValue(j, "VAL_PARA_3").toString();

				String cmdx = cmd.replaceAll("VAR_PARA_1", valPara1).replaceAll("VAR_PARA_2", valPara2)
						.replaceAll("VAR_PARA_3", valPara3);

				String titx = tit.replaceAll("VAR_PARA_1", valPara1).replaceAll("VAR_PARA_2", valPara2)
						.replaceAll("VAR_PARA_3", valPara3);

				String titax = tita.replaceAll("VAR_PARA_1", valPara1).replaceAll("VAR_PARA_2", valPara2)
						.replaceAll("VAR_PARA_3", valPara3);

				String descrx = descr.replaceAll("VAR_PARA_1", valPara1).replaceAll("VAR_PARA_2", valPara2)
						.replaceAll("VAR_PARA_3", valPara3);

				String descrax = descra.replaceAll("VAR_PARA_1", valPara1).replaceAll("VAR_PARA_2", valPara2)
						.replaceAll("VAR_PARA_3", valPara3);

				Timestamp loggedTime = new Timestamp(((Date) logTb.getFieldValue(j, "LOGGED_TIME")).getTime());
				if (loggedTime.after(ln) && tableName.equals("ACACCOUNT") && valPara1.equals(cs)) {
					ln.setTime(loggedTime.getTime());
					String d1 = utils.nvl(descrx,
							"USER #" + usernm + ", Account # " + cs + " have " + transType + " !, time : " + ln);
					utils.insertNotify(this.mDbc.getDbConnection(), un, "ACACCOUNT", d1, cmdx, usernm, dclk, titx,
							titax, descrax);
					this.mLctb.setFieldValue(i, "LAST_NOTIFIED_TIME", ln);
					QueryExe.execute("update c7_notify_setup set LAST_NOTIFIED_TIME=:LN where keyfld=" + kf,
							this.mDbc.getDbConnection(), new Parameter("LN", ln));

				}
			}

		}

		private void refreshSetupData() throws SQLException, ParseException {
			String vl = utils.getSqlValue(
					"select to_char(max(modified_time),'dd/mm/rrrr hh24:MM:SS') from c7_notify_setup",
					mDbc.getDbConnection());
			if (vl != null && !vl.equals("")) {
				SimpleDateFormat sdf = new SimpleDateFormat("dd/MM/yyyy HH:m:s");
				Date ldt = sdf.parse(vl);
				if (this.lastSetupData == null || ldt.after(this.lastSetupData)) {
					mLctb.clearALl();
					mLctb.executeQuery("select *from c7_notify_setup order by keyfld", true);
					System.out.println("Refreshed all c7_notify_setup table # " + (countRun) + "...."
							+ new Date(System.currentTimeMillis()));
					if (this.lastSetupData == null)
						this.lastSetupData = new Date(ldt.getTime());
					else
						this.lastSetupData.setTime(ldt.getTime());
				}

			}

//			if (this.lastSetupData==0){

		}

	}

	private List<String> getInitFiles() {
		List<String> ret = new ArrayList<String>();
//		String path = servletContext.getRealPath("");
		String path = System.getProperty("user.dir") + "/src/main/webapp";

		String fn = "";

		File dir = new File(path);
		if (dir.listFiles() == null) {
			String s = File.separator;
			path = System.getProperty("catalina.base") + s + "webapps" + s + "c7";
			dir = new File(path);
		}

		for (File file : dir.listFiles()) {
			if (file.getName().endsWith((".ini")))
//				fn += (fn.length() > 0 ? "," : "") + "{ \"file\" :" + "\"" + file.getName() + "\" }";
				ret.add(path + "/" + file.getName());
		}

//		ret.add(fn);

		return ret;
	}

	private boolean started = false;

	public void startAll() {
		if (this.started)
			return;

		List<String> lstFiles = this.getInitFiles();
		for (String file : lstFiles) {
			UserNotifications un = new UserNotifications(file);
			mapUN.put(file, un);
			un.start();
		}
		this.started = true;
	}

	public Notifications() {
		startAll();
		System.out.println("Notification services started ..");
	}

}