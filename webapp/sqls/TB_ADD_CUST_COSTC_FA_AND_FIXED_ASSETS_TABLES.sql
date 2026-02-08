CREATE TABLE C7_FADEP
(
  KEYFLD     NUMBER                             NOT NULL,
  REC_DATE   DATE                               NOT NULL,
  REC_TYPE   VARCHAR2(255 BYTE)                 NOT NULL,
  ITM_CODE   VARCHAR2(500 BYTE)                 NOT NULL,
  REC_VAL    NUMBER                             DEFAULT 0                     NOT NULL,
  JV_KEYFLD  NUMBER,
  FLAG       NUMBER                             DEFAULT 1                     NOT NULL,
  JV_POS     NUMBER
)
TABLESPACE USERS
PCTUSED    0
PCTFREE    10
INITRANS   1
MAXTRANS   255
STORAGE    (
            INITIAL          64K
            MINEXTENTS       1
            MAXEXTENTS       UNLIMITED
            PCTINCREASE      0
            BUFFER_POOL      DEFAULT
           )
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;

COMMENT ON COLUMN C7_FADEP.REC_TYPE IS 'BF_';


CREATE TABLE FAITEMS
(
  KEYFLD           NUMBER                       NOT NULL,
  CODE             VARCHAR2(100 BYTE)           NOT NULL,
  CATNO            VARCHAR2(100 BYTE)           NOT NULL,
  ACCNO            VARCHAR2(100 BYTE)           NOT NULL,
  DEPACCNO         VARCHAR2(100 BYTE)           NOT NULL,
  EXPACCNO         VARCHAR2(100 BYTE)           NOT NULL,
  PURPRICE         NUMBER                       NOT NULL,
  PURDATE          DATE                         NOT NULL,
  NETBOOKVALUE     NUMBER                       NOT NULL,
  DEPRATE          NUMBER                       NOT NULL,
  COSTCENT         VARCHAR2(100 BYTE),
  DESCR            VARCHAR2(255 BYTE),
  PUR_INV_DATE     DATE,
  BF_DEPDATE       DATE,
  BF_DEPAMT        NUMBER                       DEFAULT 0                     NOT NULL,
  BF_ADD           NUMBER                       DEFAULT 0                     NOT NULL,
  BF_DED           NUMBER                       DEFAULT 0                     NOT NULL,
  LAST_DEP_POSTED  DATE,
  FLAG             NUMBER                       DEFAULT 1                     NOT NULL
)
TABLESPACE USERS
PCTUSED    0
PCTFREE    10
INITRANS   1
MAXTRANS   255
STORAGE    (
            INITIAL          128K
            MINEXTENTS       1
            MAXEXTENTS       UNLIMITED
            PCTINCREASE      0
            BUFFER_POOL      DEFAULT
           )
LOGGING 
NOCOMPRESS 
NOCACHE
NOPARALLEL
MONITORING;


CREATE UNIQUE INDEX FAITEMS_PK ON FAITEMS
(CODE)
LOGGING
TABLESPACE USERS
PCTFREE    10
INITRANS   2
MAXTRANS   255
STORAGE    (
            INITIAL          64K
            MINEXTENTS       1
            MAXEXTENTS       UNLIMITED
            PCTINCREASE      0
            BUFFER_POOL      DEFAULT
           )
NOPARALLEL;


ALTER TABLE FAITEMS ADD (
  CONSTRAINT FAITEMS_PK
 PRIMARY KEY
 (CODE)
    USING INDEX 
    TABLESPACE USERS
    PCTFREE    10
    INITRANS   2
    MAXTRANS   255
    STORAGE    (
                INITIAL          64K
                MINEXTENTS       1
                MAXEXTENTS       UNLIMITED
                PCTINCREASE      0
               ));


CREATE OR REPLACE FORCE VIEW C7_FAITEMS_TREE
(
   CODE,
   PARENTCATNO,
   ACCNO,
   DEPACCNO,
   EXPACCNO,
   PURPRICE,
   PURDATE,
   NETBOOKVALUE,
   DEPRATE,
   COSTCENT,
   NAME,
   NAMEA,
   PUR_INV_DATE,
   BF_DEPDATE,
   BF_DEPAMT,
   BF_ADD,
   BF_DED,
   LAST_DEP_POSTED,
   FLAG,
   CHILDCOUNT,
   LEVELNO,
   PATH
)
AS
   SELECT   CATNO code,
            '' PARENTCATNO,
            '' ACCNO,
            '' DEPACCNO,
            '' EXPACCNO,
            0 PURPRICE,
            NULL PURDATE,
            1 NETBOOKVALUE,
            0 DEPRATE,
            '' COSTCENT,
            CATNAME NAME,
            '' NAMEA,
            NULL PUR_INV_DATE,
            NULL BF_DEPDATE,
            0 BF_DEPAMT,
            0 BF_ADD,
            0 BF_DED,
            NULL LAST_DEP_POSTED,
            1 FLAG,
            1 childcount,
            1 levelno,
            'XXX\' || CATNO || '\' PATH
     FROM   FACAT
   UNION ALL
   SELECT   CODE,
            CATNO PARENTCATNO,
            ACCNO,
            DEPACCNO,
            EXPACCNO,
            PURPRICE,
            PURDATE,
            NETBOOKVALUE,
            DEPRATE,
            COSTCENT,
            DESCR NAME,
            '' NAMEA,
            PUR_INV_DATE,
            BF_DEPDATE,
            BF_DEPAMT,
            BF_ADD,
            BF_DED,
            LAST_DEP_POSTED,
            FLAG,
            0 childcount,
            2 levelno,
               'XXX\'
            || (CASE WHEN CATNO IS NOT NULL THEN CATNO || '\' ELSE '' END)
            || CODE
            || '\'
               PATH
     FROM   FAITEMS
   ORDER BY   PATH;

/* Formatted on 08/02/2026 06:11:18 ã (QP5 v5.115.810.9015) */
CREATE OR REPLACE FORCE VIEW C7_TBACC
(
   ACCNO,
   NAME,
   NAMEA,
   PARENTACC,
   PATH,
   BDEB,
   BCRD,
   TDEB,
   TCRD,
   CDEB,
   CCRD,
   LEVELNO,
   CHILDCOUNT
)
AS
     SELECT   field1 accno,
              acaccount.name,
              NVL (acaccount.namea, name) namea,
              field19 parentacc,
              field17 PATH,
              TO_NUMBER (field5) bdeb,
              TO_NUMBER (field6) bcrd,
              TO_NUMBER (field7) tdeb,
              TO_NUMBER (field8) tcrd,
              TO_NUMBER (field13) cdeb,
              TO_NUMBER (field14) ccrd,
              TO_NUMBER (FIELD16) levelno,
              TO_NUMBER (field18) childcount
       FROM   temporary, acaccount
      WHERE       idno = 66601
              AND temporary.field1 = acaccount.accno
              AND REGEXP_LIKE (field14, '^[+-]?\d+(\.\d+)?$')
              AND REGEXP_LIKE (field13, '^[+-]?\d+(\.\d+)?$')
              AND temporary.usernm = '01'
   ORDER BY   field17;


/* Formatted on 08/02/2026 06:11:18 ã (QP5 v5.115.810.9015) */
CREATE OR REPLACE FORCE VIEW C7_TBCC
(
   ACCNO,
   NAME,
   NAMEA,
   PARENTACC,
   PATH,
   BDEB,
   BCRD,
   TDEB,
   TCRD,
   CDEB,
   CCRD,
   LEVELNO,
   CHILDCOUNT
)
AS
     SELECT   field1 accno,
              accostcent1.title name,
              NVL (accostcent1.titlea, title) namea,
              field19 parentacc,
              field17 PATH,
              TO_NUMBER (field5) bdeb,
              TO_NUMBER (field6) bcrd,
              TO_NUMBER (field7) tdeb,
              TO_NUMBER (field8) tcrd,
              TO_NUMBER (field13) cdeb,
              TO_NUMBER (field14) ccrd,
              TO_NUMBER (FIELD16) levelno,
              TO_NUMBER (field18) childcount
       FROM   temporary, accostcent1
      WHERE       temporary.idno = 66601
              AND temporary.field1 = accostcent1.code
              AND REGEXP_LIKE (field14, '^[+-]?\d+(\.\d+)?$')
              AND REGEXP_LIKE (field13, '^[+-]?\d+(\.\d+)?$')
              AND TO_NUMBER (field13) - TO_NUMBER (field14) != 0
              AND temporary.usernm = '01'
   ORDER BY   field17;


/* Formatted on 08/02/2026 06:11:18 ã (QP5 v5.115.810.9015) */
CREATE OR REPLACE FORCE VIEW C7_TBFA
(
   ACCNO,
   NAME,
   NAMEA,
   PARENTACC,
   PATH,
   BDEB,
   BCRD,
   TDEB,
   TCRD,
   CDEB,
   CCRD,
   LEVELNO,
   CHILDCOUNT
)
AS
     SELECT   field1 accno,
              FA.name,
              NVL (FA.namea, name) namea,
              field19 parentacc,
              field17 PATH,
              TO_NUMBER (field5) bdeb,
              TO_NUMBER (field6) bcrd,
              TO_NUMBER (field7) tdeb,
              TO_NUMBER (field8) tcrd,
              TO_NUMBER (field13) cdeb,
              TO_NUMBER (field14) ccrd,
              TO_NUMBER (FIELD16) levelno,
              TO_NUMBER (field18) childcount
       FROM   temporary, C7_FAITEMS_TREE FA
      WHERE       idno = 66601
              AND temporary.field1 = FA.code
              AND REGEXP_LIKE (field14, '^[+-]?\d+(\.\d+)?$')
              AND REGEXP_LIKE (field13, '^[+-]?\d+(\.\d+)?$')
              AND temporary.usernm = '01'
   ORDER BY   field17;


/* Formatted on 08/02/2026 06:11:18 ã (QP5 v5.115.810.9015) */
CREATE OR REPLACE FORCE VIEW C7_TBRP
(
   ACCNO,
   NAME,
   NAMEA,
   PARENTACC,
   PATH,
   BDEB,
   BCRD,
   TDEB,
   TCRD,
   CDEB,
   CCRD,
   LEVELNO,
   CHILDCOUNT
)
AS
     SELECT   field1 accno,
              c_ycust.name name,
              NVL (c_ycust.namea, name) namea,
              field19 parentacc,
              field17 PATH,
              TO_NUMBER (field5) bdeb,
              TO_NUMBER (field6) bcrd,
              TO_NUMBER (field7) tdeb,
              TO_NUMBER (field8) tcrd,
              TO_NUMBER (field13) cdeb,
              TO_NUMBER (field14) ccrd,
              TO_NUMBER (FIELD16) levelno,
              TO_NUMBER (field18) childcount
       FROM   temporary, c_ycust
      WHERE       idno = 66601
              AND temporary.field1 = c_ycust.code
              AND REGEXP_LIKE (field14, '^[+-]?\d+(\.\d+)?$')
              AND REGEXP_LIKE (field13, '^[+-]?\d+(\.\d+)?$')
              AND temporary.usernm = '01'
   ORDER BY   field17;



CREATE OR REPLACE PACKAGE       CP_ACC
AS
pfromdt date:=to_date('01/01/2000','dd/mm/rrrr');
ptodt date:=sysdate;
pfromacc varchar2(100);
ptoacc varchar2(100);
pfromcust varchar2(100);
ptocust varchar2(100);
pacpath varchar2(4000);
punposted VARCHAR2(100):='N';
plevelno integer:=0;
pisAll varchar2(10):='Y';
plastuid varchar2(300);
prnp varchar2(10):='N';
pcc varchar2(100):=''; -- costcent
procedure build_gl(uid varchar2);
procedure build_rp(uid varchar2);
procedure build_cc(uid varchar2);
procedure build_fa(uid varchar2);
procedure resetvars;

end;
/


CREATE OR REPLACE PACKAGE    CP_ACCBAL_GL_TRANS IS
CNTS 		FLOAT:=0;
CNTS_t 		FLOAT:=0;
PFROMDT		DATE;
PTODT		DATE;
PUNPOSTED   VARCHAR2(100):='N';
pcc varchar2(100):=null;

cursor 		atrans is
			SELECT ALL acaccount.accno, acaccount.NAME, acaccount.namea,
              acaccount.PATH, NVL (SUM (acvoucher2.debit), 0) debit,
              NVL (SUM (acvoucher2.credit), 0) credit, levelno, childcount,
              acaccount.iscust, acaccount.start_date, acaccount.LIMIT,
              acaccount.costcent, acaccount.flag, acaccount.TYPE
         FROM acaccount, acvoucher2
        WHERE (acvoucher2.accno = acaccount.accno)
          AND vou_date >= PFROMDT and vou_date<=PTODT and (acvoucher2.flag=2 OR PUNPOSTED='Y')
          and (acvoucher2.costcent=pcc or pcc is null) 
     GROUP BY acaccount.accno,
              acaccount.NAME,
              acaccount.namea,
              acaccount.PATH,
              levelno,
              childcount,
              acaccount.iscust,
              acaccount.start_date,
              acaccount.LIMIT,
              acaccount.costcent,
              acaccount.flag,
              acaccount.TYPE;

cursor 						abeg is
							SELECT ALL acaccount.accno, acaccount.NAME, acaccount.namea,
              acaccount.PATH, NVL (SUM (acvoucher2.debit), 0) debit,
              NVL (SUM (acvoucher2.credit), 0) credit, levelno, childcount,
              acaccount.iscust, acaccount.start_date, acaccount.LIMIT,
              acaccount.costcent, acaccount.flag, acaccount.TYPE
         FROM acaccount, acvoucher2
        WHERE (acvoucher2.accno = acaccount.accno) and (acvoucher2.flag=2 OR PUNPOSTED='Y')
          AND vou_date < PFROMDT
          and (acvoucher2.costcent=pcc or pcc is null)
     GROUP BY acaccount.accno,
              acaccount.NAME,
              acaccount.namea,
              acaccount.PATH,
              levelno,
              childcount,
              acaccount.iscust,
              acaccount.start_date,
              acaccount.LIMIT,
              acaccount.costcent,
              acaccount.flag,
              acaccount.TYPE;


TYPE tag_accs is record  (
  accno 					varchar2(100),
  path 						varchar2(2000),
  debit						float,
	credit					float
  );

type 							acc_array is table of
									tag_accs index by binary_integer;
actb 							acc_array ;
actb_t 						acc_array ;


procedure					build_accs;
function					get_debit_sum_bf(pth varchar2) return float;
function					get_credit_sum_bf(pth varchar2) return float;
function					get_debit_sum_t(pth varchar2) return float;
function					get_credit_sum_t(pth varchar2) return float;

END;
/


CREATE OR REPLACE PACKAGE    CP_ACCBAL_GL_TRANS_MONTHLY IS
CNTS 		FLOAT:=0;
CNTS_t 		FLOAT:=0;
PFROMDT		DATE;
PTODT		DATE;
PUNPOSTED   VARCHAR2(100):='N';
pcc varchar2(100):=null;

cursor 		atrans is
			SELECT ALL acaccount.accno, acaccount.NAME, acaccount.namea,
              acaccount.PATH, NVL (SUM (acvoucher2.debit), 0) debit,
              NVL (SUM (acvoucher2.credit), 0) credit, levelno, childcount,
              acaccount.iscust, acaccount.start_date, acaccount.LIMIT,
              acaccount.costcent, acaccount.flag, acaccount.TYPE,TO_CHAR(VOU_DATE,'RRRR/MM') MNTH
         FROM acaccount, acvoucher2
        WHERE (acvoucher2.accno = acaccount.accno)
          AND vou_date >= PFROMDT and vou_date<=PTODT and (acvoucher2.flag=2 OR PUNPOSTED='Y')
            and (acvoucher2.costcent=pcc or pcc is null) 
     GROUP BY acaccount.accno,
              acaccount.NAME,
              acaccount.namea,
              acaccount.PATH,
              levelno,
              childcount,
              acaccount.iscust,
              acaccount.start_date,
              acaccount.LIMIT,
              acaccount.costcent,
              acaccount.flag,
              acaccount.TYPE,
              TO_CHAR(VOU_DATE,'RRRR/MM')
      ORDER BY ACACCOUNT.ACCNO,
                TO_CHAR(VOU_DATE,'RRRR/MM');

cursor 						abeg is
							SELECT ALL acaccount.accno, acaccount.NAME, acaccount.namea,
              acaccount.PATH, NVL (SUM (acvoucher2.debit), 0) debit,
              NVL (SUM (acvoucher2.credit), 0) credit, levelno, childcount,
              acaccount.iscust, acaccount.start_date, acaccount.LIMIT,
              acaccount.costcent, acaccount.flag, acaccount.TYPE
         FROM acaccount, acvoucher2
        WHERE (acvoucher2.accno = acaccount.accno) and  (acvoucher2.flag=2 OR PUNPOSTED='Y')
            and (acvoucher2.costcent=pcc or pcc is null) 
          AND vou_date < PFROMDT
     GROUP BY acaccount.accno,
              acaccount.NAME,
              acaccount.namea,
              acaccount.PATH,
              levelno,
              childcount,
              acaccount.iscust,
              acaccount.start_date,
              acaccount.LIMIT,
              acaccount.costcent,
              acaccount.flag,
              acaccount.TYPE;


TYPE tag_accs is record  (
  accno 					varchar2(100),
  path 						varchar2(2000),
  mnth                      varchar2(100),
  debit						float,
	credit					float
  );

type 							acc_array is table of
									tag_accs index by binary_integer;
actb 							acc_array ;
actb_t 						acc_array ;


procedure					build_accs;
function					get_debit_sum_bf(pth varchar2) return float;
function					get_credit_sum_bf(pth varchar2) return float;
function					get_debit_sum_t(pth varchar2,pmnth varchar2) return float;
   FUNCTION get_credit_sum_t (pth VARCHAR2,pmnth varchar2)  RETURN FLOAT;

END;
/


CREATE OR REPLACE PACKAGE       CP_COSTC_TRANS IS
CNTS 		FLOAT:=0;
CNTS_t 		FLOAT:=0;
PFROMDT		DATE;
PTODT		DATE;
PUNPOSTED   VARCHAR2(100):='N';
pcc varchar2(100);

cursor 		atrans is
SELECT ALL accostcent1.code accno, accostcent1.title name, accostcent1.titlea namea,
              accostcent1.PATH, NVL (SUM (acvoucher2.debit), 0) debit,
              NVL (SUM (acvoucher2.credit), 0) credit, levelno, childcount              
         FROM acvoucher2, accostcent1
        WHERE (acvoucher2.costcent = accostcent1.code)
          AND vou_date >= PFROMDT and vou_date<=ptodt 
         and  (acvoucher2.flag=2 OR PUNPOSTED='Y')
     GROUP BY accostcent1.code,
              accostcent1.title,
              accostcent1.titlea,
              accostcent1.PATH,
              levelno,
              childcount;

cursor 						abeg is
SELECT ALL accostcent1.code accno, accostcent1.title name, accostcent1.titlea namea,
              accostcent1.PATH, NVL (SUM (acvoucher2.debit), 0) debit,
              NVL (SUM (acvoucher2.credit), 0) credit, levelno, childcount              
         FROM acvoucher2, accostcent1
        WHERE (acvoucher2.costcent = accostcent1.code)
          AND vou_date < PFROMDT  
         and  (acvoucher2.flag=2 OR PUNPOSTED='Y')
     GROUP BY accostcent1.code,
              accostcent1.title,
              accostcent1.titlea,
              accostcent1.PATH,
              levelno,
              childcount;

TYPE tag_accs is record  (
  accno 					varchar2(100),
  path 						varchar2(2000),
  debit						float,
	credit					float
  );

type 							acc_array is table of
									tag_accs index by binary_integer;
actb 							acc_array ;
actb_t 						acc_array ;


procedure					build_accs;
function					get_debit_sum_bf(pth varchar2) return float;
function					get_credit_sum_bf(pth varchar2) return float;
function					get_debit_sum_t(pth varchar2) return float;
function					get_credit_sum_t(pth varchar2) return float;

END;
/


CREATE OR REPLACE PACKAGE      CP_CUST_TRANS IS
CNTS 		FLOAT:=0;
CNTS_t 		FLOAT:=0;
PFROMDT		DATE;
PTODT		DATE;
PUNPOSTED   VARCHAR2(100):='N';
pcc varchar2(100);

cursor 		atrans is
			SELECT ALL c_ycust.code accno, c_ycust.NAME, c_ycust.namea,
              c_ycust.PATH, NVL (SUM (acvoucher2.debit), 0) debit,
              NVL (SUM (acvoucher2.credit), 0) credit, levelno, childcount              
         FROM c_ycust, acvoucher2
        WHERE (acvoucher2.cust_code = c_ycust.code)
          AND vou_date >= PFROMDT and vou_date<=PTODT and (acvoucher2.flag=2 OR PUNPOSTED='Y')
          and (acvoucher2.costcent=pcc or pcc is null)
     GROUP BY c_ycust.code,
              c_ycust.NAME,
              c_ycust.namea,
              c_ycust.PATH,
              levelno,
              childcount;

cursor 						abeg is
							SELECT ALL c_ycust.code accno, c_ycust.NAME, c_ycust.namea,
              c_ycust.PATH, NVL (SUM (acvoucher2.debit), 0) debit,
              NVL (SUM (acvoucher2.credit), 0) credit, levelno, childcount
         FROM c_ycust, acvoucher2
        WHERE (acvoucher2.cust_code = c_ycust.code) and (acvoucher2.flag=2 OR PUNPOSTED='Y')
        and (acvoucher2.costcent=pcc or pcc is null)
          AND vou_date < PFROMDT
     GROUP BY c_ycust.code,
              c_ycust.NAME,
              c_ycust.namea,
              c_ycust.PATH,
              levelno,
              childcount,
              c_ycust.iscust;

TYPE tag_accs is record  (
  accno 					varchar2(100),
  path 						varchar2(2000),
  debit						float,
	credit					float
  );

type 							acc_array is table of
									tag_accs index by binary_integer;
actb 							acc_array ;
actb_t 						acc_array ;


procedure					build_accs;
function					get_debit_sum_bf(pth varchar2) return float;
function					get_credit_sum_bf(pth varchar2) return float;
function					get_debit_sum_t(pth varchar2) return float;
function					get_credit_sum_t(pth varchar2) return float;

END;
/


CREATE OR REPLACE PACKAGE       CP_FA_TRANS IS
CNTS 		FLOAT:=0;
CNTS_t 		FLOAT:=0;
PFROMDT		DATE;
PTODT		DATE;
PUNPOSTED   VARCHAR2(100):='N';
pcc varchar2(100);

cursor 		atrans is
			SELECT ALL FA.code accno, FA.NAME, FA.namea,
              FA.PATH, NVL (SUM (CASE WHEN C7_FADEP.REC_VAL>0 THEN C7_FADEP.REC_VAL ELSE 0 END), 0) debit,
              NVL (SUM (CASE WHEN C7_FADEP.REC_VAL<0 THEN abs(C7_FADEP.REC_VAL) ELSE 0 END), 0) credit, levelno, childcount              
         FROM C7_FAITEMS_TREE FA,C7_FADEP
        WHERE (C7_FADEP.itm_code = FA.code)
          AND REC_date >= PFROMDT and rec_date<=PTODT 
     GROUP BY fa.code,
              fa.NAME,
              fa.namea,
              fa.PATH,
              fa.levelno,
              fa.childcount
     order by path;

cursor                         abeg is
            SELECT ALL FA.code accno, FA.NAME, FA.namea,
              FA.PATH, NVL (SUM (CASE WHEN C7_FADEP.REC_VAL>0 THEN C7_FADEP.REC_VAL ELSE 0 END), 0) debit,
              NVL (SUM (CASE WHEN C7_FADEP.REC_VAL<0 THEN abs(C7_FADEP.REC_VAL) ELSE 0 END), 0) credit, levelno, childcount              
         FROM C7_FAITEMS_TREE FA,C7_FADEP
        WHERE (C7_FADEP.itm_code = FA.code)
          AND REC_date < PFROMDT  
     GROUP BY fa.code,
              fa.NAME,
              fa.namea,
              fa.PATH,
              fa.levelno,
              fa.childcount
           order by path;              
--cursor 						abeg is
--							SELECT ALL c_ycust.code accno, c_ycust.NAME, c_ycust.namea,
--              c_ycust.PATH, NVL (SUM (acvoucher2.debit), 0) debit,
--              NVL (SUM (acvoucher2.credit), 0) credit, levelno, childcount
--         FROM c_ycust, acvoucher2
--        WHERE (acvoucher2.cust_code = c_ycust.code) and (acvoucher2.flag=2 OR PUNPOSTED='Y')
--        and (acvoucher2.costcent=pcc or pcc is null)
--          AND vou_date < PFROMDT
--     GROUP BY c_ycust.code,
--              c_ycust.NAME,
--              c_ycust.namea,
--              c_ycust.PATH,
--              levelno,
--              childcount,
--              c_ycust.iscust;

TYPE tag_accs is record  (
  accno 					varchar2(100),
  path 						varchar2(2000),
  debit						float,
	credit					float
  );

type 							acc_array is table of
									tag_accs index by binary_integer;
actb 							acc_array ;
actb_t 						acc_array ;


procedure					build_accs;
function					get_debit_sum_bf(pth varchar2) return float;
function					get_credit_sum_bf(pth varchar2) return float;
function					get_debit_sum_t(pth varchar2) return float;
function					get_credit_sum_t(pth varchar2) return float;

END;
/



CREATE OR REPLACE PACKAGE BODY       CP_ACC AS

/*  field1  = accno
    field2  = name
    field3  = bdr
    field4  = bcr
    field5  = bdr_bal
    field6  = bcr_bal
    field7  = tdr
    field8  = tcr
    field9  = tdr_bal
    field10  = tcr_bal
    field11 = edr
    field12  = ecr
    field13  = edr_bal
    field14 = ecr_bal
    field15 - pos
    field16 = levelno
    field17 = path
        field18 =childcount
*/
 cursor act is select '' accno,'' path,0 levelno,'' name,0 childcount,'' parentacc from dual;
actyp act%rowtype;
 bdr number:=0;
  bcr number:=0;
  tdr number:=0;
  tcr number:=0;
  bdr_bal number:=0;
  bcr_bal number:=0;
  tdr_bal number:=0;
  tcr_bal number:=0;
  edr number:=0;
  ecr number:=0;
  edr_bal number:=0;
  ecr_bal number:=0;
  posx integer:=0;
  cursor rpac is select distinct ac_no from c_ycust;
  type array_S is table of varchar2(255);
  acns dbms_sql.varchar2_table;
  cnt_acns number:=0;
  tmpfnd boolean:=false;
  cstpath varchar2(4000);
  
PROCEDURE resetvars is
begin
  bdr:=0;
  bcr :=0;
  tdr :=0;
  tcr :=0;
  bdr_bal :=0;
  bcr_bal :=0;
  tdr_bal :=0;
  tcr_bal :=0;
  edr :=0;
  ecr :=0;
  edr_bal :=0;
  ecr_bal :=0;
  posx :=0;
  cnt_acns :=0;
  tmpfnd:=false;
  cstpath :='';

end;
procedure insertTmp(x act%rowtype,uid varchar2) is
begin
      edr :=bdr+tdr;
      ecr :=bcr+tcr;
    bdr_bal:=0; bcr_bal:=0;
    edr_bal:=0; ecr_bal:=0;
    tdr_bal:=0; tcr_bal:=0;
      if (bdr-bcr)>=0 then
       bdr_bal :=(bdr-bcr);
       else
        bcr_bal:=abs(bdr-bcr);
    end if;

      if (tdr-tcr)>=0 then
       tdr_bal :=(tdr-tcr);
       else
        tcr_bal:=abs(tdr-tcr);
    end if;

      if (edr-ecr)>=0 then
       edr_bal :=(edr-ecr);
       else
        ecr_bal:=abs(edr-ecr);
    end if;

    posx:=posx+1;
    --dbms_output.put_line(x.path);
      insert into temporary(idno,usernm,field1,field2,field3,field4,field5,field6,
                           field7,field8,field9,field10,field11,
                        field12,field13,field14,field15,field16,field17,field18,FIELD19)
                        values
                        (66601,uid,
                        trim(x.accno),
                        trim(x.name),
                        bdr,bcr,bdr_bal,bcr_bal,
                        tdr,tcr,tdr_bal,tcr_bal,
                        edr,ecr,edr_bal,ecr_bal,posx,
                        x.levelno,trim(x.path),x.childcount,trim(x.parentacc));
end;

PROCEDURE BUILD_GL(uid varchar2) is
/*  field1  = accno
	field2  = name
	field3  = bdr
	field4  = bcr
	field5  = bdr_bal
	field6  = bcr_bal
	field7  = tdr
	field8  = tcr
	field9  = tdr_bal
	field10  = tcr_bal
	field11 = edr
	field12  = ecr
	field13  = edr_bal
	field14 = ecr_bal
	field15 - pos
	field16 = levelno
	field17 = path
		field18 =childcount
*/
cursor acs is select accno,path,levelno,name,childcount,parentacc from acaccount where
  (levelno<=plevelno or plevelno=0) and actype=0 and path like pacpath||'%' order by path;
 
  cursor rps(pa varchar2) is select code,name,namea,path,ac_no,parentcustomer,childcount,levelno from c_ycust where ac_no=pa and childcount=0 order by path; 
begin
resetvars;
if (pfromacc is not null) then
  select path into pacpath from acaccount where accno=pfromacc;
  else
  pacpath:='';
end if;
  CP_ACCBAL_GL_TRANS.PFROMDT:=pfromdt;
  CP_ACCBAL_GL_TRANS.PTODT:=ptodt;
  CP_ACCBAL_GL_TRANS.PUNPOSTED:=PUNPOSTED;
  CP_ACCBAL_GL_TRANS.pcc:=pcc;
  CP_ACCBAL_GL_TRANS.build_accs;
  
  plastuid:=uid;
  delete from temporary where idno=66601 AND USERNM=UID;

  for x in acs
  loop

    bdr :=CP_ACCBAL_GL_TRANS.get_debit_sum_bf(x.path||'%');
	bcr :=CP_ACCBAL_GL_TRANS.get_credit_sum_bf(x.path||'%');
  	tdr :=CP_ACCBAL_GL_TRANS.get_debit_sum_t(x.path||'%');
  	tcr :=CP_ACCBAL_GL_TRANS.get_credit_sum_t(x.path||'%');
    insertTmp(x,uid);
--  	edr :=bdr+tdr;
--  	ecr :=bcr+tcr;
--	bdr_bal:=0; bcr_bal:=0;
--	edr_bal:=0; ecr_bal:=0;
--	tdr_bal:=0; tcr_bal:=0;
--  	if (bdr-bcr)>=0 then
--  	 bdr_bal :=(bdr-bcr);
--   	else
--   	 bcr_bal:=abs(bdr-bcr);
--	end if;

--  	if (tdr-tcr)>=0 then
--  	 tdr_bal :=(tdr-tcr);
--   	else
--   	 tcr_bal:=abs(tdr-tcr);
--	end if;

--  	if (edr-ecr)>=0 then
--  	 edr_bal :=(edr-ecr);
--   	else
--   	 ecr_bal:=abs(edr-ecr);
--	end if;

--	posx:=posx+1;
--  	insert into temporary(idno,usernm,field1,field2,field3,field4,field5,field6,
--		   				field7,field8,field9,field10,field11,
--						field12,field13,field14,field15,field16,field17,field18,FIELD19)
--						values
--						(66601,uid,
--						x.accno,
--						x.name,
--						bdr,bcr,bdr_bal,bcr_bal,
--						tdr,tcr,tdr_bal,tcr_bal,
--						edr,ecr,edr_bal,ecr_bal,posx,
--						x.levelno,x.path,x.childcount,x.parentacc);                                                           
  end loop;
end;


PROCEDURE BUILD_RP(uid varchar2) is

cursor acs is select CODE accno,path,levelno,name,childcount,PARENTCUSTOMER parentacc from C_YCUST where
  (levelno<=plevelno or plevelno=0)  and path like pacpath||'%' order by path;

  cursor rps(pa varchar2) is select code,name,namea,path,ac_no,parentcustomer,childcount,levelno from c_ycust where ac_no=pa and childcount=0 order by path; 
begin
resetvars;
if (pfromacc is not null) then
  select path into pacpath from c_ycust where code=pfromacc;
  else
  pacpath:='';
end if;
  for rx in rpac loop
   cnt_acns:=cnt_acns+1;
   acns(cnt_acns):=rx.ac_no;     
  end loop;
  CP_CUST_TRANS.PFROMDT:=pfromdt;
  CP_CUST_TRANS.PTODT:=ptodt;
  CP_CUST_TRANS.PUNPOSTED:=PUNPOSTED;
  CP_CUST_TRANS.pcc:=pcc;
  CP_CUST_TRANS.build_accs;

  plastuid:=uid;
  delete from temporary where idno=66601 AND USERNM=UID;

  for x in acs
  loop

    bdr :=CP_CUST_TRANS.get_debit_sum_bf(x.path||'%');
    bcr :=CP_CUST_TRANS.get_credit_sum_bf(x.path||'%');
      tdr :=CP_CUST_TRANS.get_debit_sum_t(x.path||'%');
      tcr :=CP_CUST_TRANS.get_credit_sum_t(x.path||'%');
    insertTmp(x,uid);
                                                  
  end loop;
end;
PROCEDURE build_cc(uid varchar2) is

cursor acs is select CODE accno,path,levelno,title name,childcount,parentcostcent parentacc from accostcent1 where
  (levelno<=plevelno or plevelno=0)  and path like pacpath||'%' order by path;

  cursor rps(pa varchar2) is select code,name,namea,path,ac_no,parentcustomer,childcount,levelno from c_ycust where ac_no=pa and childcount=0 order by path; 
begin
resetvars;
if (pfromacc is not null) then
  select path into pacpath from c_ycust where code=pfromacc;
  else
  pacpath:='';
end if;
  for rx in rpac loop
   cnt_acns:=cnt_acns+1;
   acns(cnt_acns):=rx.ac_no;     
  end loop;
  CP_COSTC_TRANS.PFROMDT:=pfromdt;
  CP_COSTC_TRANS.PTODT:=ptodt;
  CP_COSTC_TRANS.PUNPOSTED:=PUNPOSTED;
  CP_COSTC_TRANS.pcc:=pcc;
  CP_COSTC_TRANS.build_accs;

  plastuid:=uid;
  delete from temporary where idno=66601 AND USERNM=UID;

  for x in acs
  loop

    bdr :=CP_COSTC_TRANS.get_debit_sum_bf(x.path||'%');
    bcr :=CP_COSTC_TRANS.get_credit_sum_bf(x.path||'%');
      tdr :=CP_COSTC_TRANS.get_debit_sum_t(x.path||'%');
      tcr :=CP_COSTC_TRANS.get_credit_sum_t(x.path||'%');
    insertTmp(x,uid);
                                                  
  end loop;
end;

PROCEDURE build_fa(uid varchar2) is

cursor acs is select CODE accno,path,levelno,name,childcount,parentcatno parentacc from C7_FAITEMS_TREE where
  (levelno<=plevelno or plevelno=0)  and path like pacpath||'%' order by path;
 
begin
resetvars;
if (pfromacc is not null) then
  select path into pacpath from c_ycust where code=pfromacc;
  else
  pacpath:='';
end if;
  for rx in rpac loop
   cnt_acns:=cnt_acns+1;
   acns(cnt_acns):=rx.ac_no;     
  end loop;
  CP_FA_TRANS.PFROMDT:=pfromdt;
  CP_FA_TRANS.PTODT:=ptodt;
  CP_FA_TRANS.PUNPOSTED:=PUNPOSTED;
  CP_FA_TRANS.pcc:=pcc;
  CP_FA_TRANS.build_accs;

  plastuid:=uid;
  delete from temporary where idno=66601 AND USERNM=UID;

  for x in acs
  loop

    bdr :=CP_FA_TRANS.get_debit_sum_bf(x.path||'%');
    bcr :=CP_FA_TRANS.get_credit_sum_bf(x.path||'%');
      tdr :=CP_FA_TRANS.get_debit_sum_t(x.path||'%');
      tcr :=CP_FA_TRANS.get_credit_sum_t(x.path||'%');
    insertTmp(x,uid);
                                                  
  end loop;
end;

END;
/


CREATE OR REPLACE PACKAGE BODY    CP_ACCBAL_GL_TRANS
IS
   PROCEDURE build_accs
   IS
   BEGIN
      FOR a IN 1 .. cnts
      LOOP
         actb (a).accno := NULL;
         actb (a).PATH := NULL;
         actb (a).credit := NULL;
         actb (a).debit := NULL;
      END LOOP;

      FOR a IN 1 .. cnts_t
      LOOP
         actb_t (a).accno := NULL;
         actb_t (a).PATH := NULL;
         actb_t (a).credit := NULL;
         actb_t (a).debit := NULL;
      END LOOP;

      cnts := 0;
      cnts_t := 0;

      FOR xx IN abeg
      LOOP
         actb (cnts + 1).accno := xx.accno;
         actb (cnts + 1).PATH := xx.PATH;
         actb (cnts + 1).debit := xx.debit;
         actb (cnts + 1).credit := xx.credit;
         cnts := cnts + 1;
      END LOOP;

      FOR xx IN atrans
      LOOP
         actb_t (cnts_t + 1).accno := xx.accno;
         actb_t (cnts_t + 1).PATH := xx.PATH;
         actb_t (cnts_t + 1).debit := xx.debit;
         actb_t (cnts_t + 1).credit := xx.credit;
         cnts_t := cnts_t + 1;
      END LOOP;
   END;

   FUNCTION get_debit_sum_bf (pth VARCHAR2)
      RETURN FLOAT
   IS
      sm   FLOAT := 0;
   BEGIN
      FOR x IN 1 .. cnts
      LOOP
         IF actb (x).PATH LIKE pth
         THEN
            sm := sm + actb (x).debit;
         END IF;
      END LOOP;

      RETURN sm;
   END;

   FUNCTION get_credit_sum_bf (pth VARCHAR2)
      RETURN FLOAT
   IS
      sm   FLOAT := 0;
   BEGIN
      FOR x IN 1 .. cnts
      LOOP
         IF actb (x).PATH LIKE pth
         THEN
            sm := sm + actb (x).credit;
         END IF;
      END LOOP;

      RETURN sm;
   END;

   FUNCTION get_credit_sum_t (pth VARCHAR2)
      RETURN FLOAT
   IS
      sm   FLOAT := 0;
   BEGIN
      FOR x IN 1 .. cnts_t
      LOOP
         IF actb_t (x).PATH LIKE pth
         THEN
            sm := sm + actb_t (x).credit;
         END IF;
      END LOOP;

      RETURN sm;
   END;

   FUNCTION get_debit_sum_t (pth VARCHAR2)
      RETURN FLOAT
   IS
      sm   FLOAT := 0;
   BEGIN
      FOR x IN 1 .. cnts_t
      LOOP
         IF actb_t (x).PATH LIKE pth
         THEN
            sm := sm + actb_t (x).debit;
         END IF;
      END LOOP;

      RETURN sm;
   END;
END;
/


CREATE OR REPLACE PACKAGE BODY    CP_ACCBAL_GL_TRANS_MONTHLY
IS
   PROCEDURE build_accs
   IS
   BEGIN
      FOR a IN 1 .. cnts
      LOOP
         actb (a).accno := NULL;
         actb (a).MNTH := NULL;
         actb (a).PATH := NULL;
         actb (a).credit := NULL;
         actb (a).debit := NULL;
      END LOOP;

      FOR a IN 1 .. cnts_t
      LOOP
         actb_t(a).accno := NULL;
         actb_t(a).PATH := NULL;
         actb_t(a).mnth := NULL;
         actb_t(a).credit := NULL;
         actb_t(a).debit := NULL;
      END LOOP;

      cnts := 0;
      cnts_t := 0;

/*
      FOR xx IN abeg
      LOOP
         actb (cnts + 1).accno := xx.accno;
         actb (cnts + 1).PATH := xx.PATH;
         actb (cnts + 1).debit := xx.debit;
         actb (cnts + 1).credit := xx.credit;
         cnts := cnts + 1;
      END LOOP;
*/
      FOR xx IN atrans
      LOOP
         actb_t (cnts_t + 1).accno := xx.accno;
         actb_t (cnts_t + 1).PATH := xx.PATH;
         actb_t (cnts_t + 1).MNTH := xx.MNTH;
         actb_t (cnts_t + 1).debit := xx.debit;
         actb_t (cnts_t + 1).credit := xx.credit;
         cnts_t := cnts_t + 1;
      END LOOP;
   END;

   FUNCTION get_debit_sum_bf (pth VARCHAR2)
      RETURN FLOAT
   IS
      sm   FLOAT := 0;
   BEGIN
      FOR x IN 1 .. cnts
      LOOP
         IF actb (x).PATH LIKE pth
         THEN
            sm := sm + actb (x).debit;
         END IF;
      END LOOP;

      RETURN sm;
   END;

   FUNCTION get_credit_sum_bf (pth VARCHAR2)
      RETURN FLOAT
   IS
      sm   FLOAT := 0;
   BEGIN
      FOR x IN 1 .. cnts
      LOOP
         IF actb(x).PATH LIKE pth
         THEN
            sm := sm + actb (x).credit;
         END IF;
      END LOOP;

      RETURN sm;
   END;

   FUNCTION get_credit_sum_t (pth VARCHAR2,pmnth varchar2)
      RETURN FLOAT
   IS
      sm   FLOAT := 0;
   BEGIN
      FOR x IN 1 .. cnts_t
      LOOP
         IF actb_t (x).PATH LIKE pth and actb_t(x).mnth=pmnth
         THEN
            sm := sm + actb_t (x).credit;
         END IF;
      END LOOP;
      RETURN sm;
   END;

   FUNCTION get_debit_sum_t (pth VARCHAR2,pmnth varchar2)
      RETURN FLOAT
   IS
      sm   FLOAT := 0;
   BEGIN
      FOR x IN 1 .. cnts_t
      LOOP
         IF actb_t (x).PATH LIKE pth and actb_t(x).mnth=pmnth
         THEN
            sm := sm + actb_t (x).debit;
         END IF;
      END LOOP;

      RETURN sm;
   END;
END;
/


CREATE OR REPLACE PACKAGE BODY       CP_COSTC_TRANS
IS
   PROCEDURE build_accs
   IS
   BEGIN
      FOR a IN 1 .. cnts
      LOOP
         actb (a).accno := NULL;
         actb (a).PATH := NULL;
         actb (a).credit := NULL;
         actb (a).debit := NULL;
      END LOOP;

      FOR a IN 1 .. cnts_t
      LOOP
         actb_t (a).accno := NULL;
         actb_t (a).PATH := NULL;
         actb_t (a).credit := NULL;
         actb_t (a).debit := NULL;
      END LOOP;

      cnts := 0;
      cnts_t := 0;

      FOR xx IN abeg
      LOOP
         actb (cnts + 1).accno := xx.accno;
         actb (cnts + 1).PATH := xx.PATH;
         actb (cnts + 1).debit := xx.debit;
         actb (cnts + 1).credit := xx.credit;
         cnts := cnts + 1;
      END LOOP;

      FOR xx IN atrans
      LOOP
         actb_t (cnts_t + 1).accno := xx.accno;
         actb_t (cnts_t + 1).PATH := xx.PATH;
         actb_t (cnts_t + 1).debit := xx.debit;
         actb_t (cnts_t + 1).credit := xx.credit;
         cnts_t := cnts_t + 1;
      END LOOP;
   END;

   FUNCTION get_debit_sum_bf (pth VARCHAR2)
      RETURN FLOAT
   IS
      sm   FLOAT := 0;
   BEGIN
      FOR x IN 1 .. cnts
      LOOP
         IF actb (x).PATH LIKE pth
         THEN
            sm := sm + actb (x).debit;
         END IF;
      END LOOP;

      RETURN sm;
   END;

   FUNCTION get_credit_sum_bf (pth VARCHAR2)
      RETURN FLOAT
   IS
      sm   FLOAT := 0;
   BEGIN
      FOR x IN 1 .. cnts
      LOOP
         IF actb (x).PATH LIKE pth
         THEN
            sm := sm + actb (x).credit;
         END IF;
      END LOOP;

      RETURN sm;
   END;

   FUNCTION get_credit_sum_t (pth VARCHAR2)
      RETURN FLOAT
   IS
      sm   FLOAT := 0;
   BEGIN
      FOR x IN 1 .. cnts_t
      LOOP
         IF actb_t (x).PATH LIKE pth
         THEN
            sm := sm + actb_t (x).credit;
         END IF;
      END LOOP;

      RETURN sm;
   END;

   FUNCTION get_debit_sum_t (pth VARCHAR2)
      RETURN FLOAT
   IS
      sm   FLOAT := 0;
   BEGIN
      FOR x IN 1 .. cnts_t
      LOOP
         IF actb_t (x).PATH LIKE pth
         THEN
            sm := sm + actb_t (x).debit;
         END IF;
      END LOOP;

      RETURN sm;
   END;
END;
/


CREATE OR REPLACE PACKAGE BODY      CP_CUST_TRANS
IS
   PROCEDURE build_accs
   IS
   BEGIN
      FOR a IN 1 .. cnts
      LOOP
         actb (a).accno := NULL;
         actb (a).PATH := NULL;
         actb (a).credit := NULL;
         actb (a).debit := NULL;
      END LOOP;

      FOR a IN 1 .. cnts_t
      LOOP
         actb_t (a).accno := NULL;
         actb_t (a).PATH := NULL;
         actb_t (a).credit := NULL;
         actb_t (a).debit := NULL;
      END LOOP;

      cnts := 0;
      cnts_t := 0;

      FOR xx IN abeg
      LOOP
         actb (cnts + 1).accno := xx.accno;
         actb (cnts + 1).PATH := xx.PATH;
         actb (cnts + 1).debit := xx.debit;
         actb (cnts + 1).credit := xx.credit;
         cnts := cnts + 1;
      END LOOP;

      FOR xx IN atrans
      LOOP
         actb_t (cnts_t + 1).accno := xx.accno;
         actb_t (cnts_t + 1).PATH := xx.PATH;
         actb_t (cnts_t + 1).debit := xx.debit;
         actb_t (cnts_t + 1).credit := xx.credit;
         cnts_t := cnts_t + 1;
      END LOOP;
   END;

   FUNCTION get_debit_sum_bf (pth VARCHAR2)
      RETURN FLOAT
   IS
      sm   FLOAT := 0;
   BEGIN
      FOR x IN 1 .. cnts
      LOOP
         IF actb (x).PATH LIKE pth
         THEN
            sm := sm + actb (x).debit;
         END IF;
      END LOOP;

      RETURN sm;
   END;

   FUNCTION get_credit_sum_bf (pth VARCHAR2)
      RETURN FLOAT
   IS
      sm   FLOAT := 0;
   BEGIN
      FOR x IN 1 .. cnts
      LOOP
         IF actb (x).PATH LIKE pth
         THEN
            sm := sm + actb (x).credit;
         END IF;
      END LOOP;

      RETURN sm;
   END;

   FUNCTION get_credit_sum_t (pth VARCHAR2)
      RETURN FLOAT
   IS
      sm   FLOAT := 0;
   BEGIN
      FOR x IN 1 .. cnts_t
      LOOP
         IF actb_t (x).PATH LIKE pth
         THEN
            sm := sm + actb_t (x).credit;
         END IF;
      END LOOP;

      RETURN sm;
   END;

   FUNCTION get_debit_sum_t (pth VARCHAR2)
      RETURN FLOAT
   IS
      sm   FLOAT := 0;
   BEGIN
      FOR x IN 1 .. cnts_t
      LOOP
         IF actb_t (x).PATH LIKE pth
         THEN
            sm := sm + actb_t (x).debit;
         END IF;
      END LOOP;

      RETURN sm;
   END;
END;
/


CREATE OR REPLACE PACKAGE BODY       CP_FA_TRANS
IS
   PROCEDURE build_accs
   IS
   BEGIN
      FOR a IN 1 .. cnts
      LOOP
         actb (a).accno := NULL;
         actb (a).PATH := NULL;
         actb (a).credit := NULL;
         actb (a).debit := NULL;
      END LOOP;

      FOR a IN 1 .. cnts_t
      LOOP
         actb_t (a).accno := NULL;
         actb_t (a).PATH := NULL;
         actb_t (a).credit := NULL;
         actb_t (a).debit := NULL;
      END LOOP;

      cnts := 0;
      cnts_t := 0;

      FOR xx IN abeg
      LOOP
         actb (cnts + 1).accno := xx.accno;
         actb (cnts + 1).PATH := xx.PATH;
         actb (cnts + 1).debit := xx.debit;
         actb (cnts + 1).credit := xx.credit;
         cnts := cnts + 1;
      END LOOP;

      FOR xx IN atrans
      LOOP
         actb_t (cnts_t + 1).accno := xx.accno;
         actb_t (cnts_t + 1).PATH := xx.PATH;
         actb_t (cnts_t + 1).debit := xx.debit;
         actb_t (cnts_t + 1).credit := xx.credit;
         cnts_t := cnts_t + 1;
      END LOOP;
   END;

   FUNCTION get_debit_sum_bf (pth VARCHAR2)
      RETURN FLOAT
   IS
      sm   FLOAT := 0;
   BEGIN
      FOR x IN 1 .. cnts
      LOOP
         IF actb (x).PATH LIKE pth
         THEN
            sm := sm + actb (x).debit;
         END IF;
      END LOOP;

      RETURN sm;
   END;

   FUNCTION get_credit_sum_bf (pth VARCHAR2)
      RETURN FLOAT
   IS
      sm   FLOAT := 0;
   BEGIN
      FOR x IN 1 .. cnts
      LOOP
         IF actb (x).PATH LIKE pth
         THEN
            sm := sm + actb (x).credit;
         END IF;
      END LOOP;

      RETURN sm;
   END;

   FUNCTION get_credit_sum_t (pth VARCHAR2)
      RETURN FLOAT
   IS
      sm   FLOAT := 0;
   BEGIN
      FOR x IN 1 .. cnts_t
      LOOP
         IF actb_t (x).PATH LIKE pth
         THEN
            sm := sm + actb_t (x).credit;
         END IF;
      END LOOP;

      RETURN sm;
   END;

   FUNCTION get_debit_sum_t (pth VARCHAR2)
      RETURN FLOAT
   IS
      sm   FLOAT := 0;
   BEGIN
      FOR x IN 1 .. cnts_t
      LOOP
         IF actb_t (x).PATH LIKE pth
         THEN
            sm := sm + actb_t (x).debit;
         END IF;
      END LOOP;

      RETURN sm;
   END;
END;
/


