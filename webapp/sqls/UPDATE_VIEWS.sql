DROP VIEW V_SECS;

CREATE OR REPLACE FORCE VIEW V_SECS
(
   MENU_GROUP,
   KEYFLD,
   MENU_ID,
   MENU_TITLE_1,
   MS_ID,
   MS_TITLE_1,
   SS_ID,
   SS_TITLE_1,
   TILE_ID,
   TILE_TITLE_1,
   SCREEN_TYPE,
   SCREEN_SIZE,
   JS_AFTER_OPEN,
   POSITION,
   PROFILES,
   SHOW_TITLE,
   EXEC_LINE,
   EXEC_TYPE,
   FOOTER_SQL,
   TILE_SIZE,
   CONTENT_JS,
   CUSTOM_OBJ
)
AS
     SELECT   s.menu_group,
              S.KEYFLD,
              S.MENU_ID,
              M.MENU_TITLE_1,
              S.MS_ID,
              MS.MS_TITLE_1,
              S.SS_ID,
              SS.SS_TITLE_1,
              S.TILE_ID,
              T.TILE_TITLE_1,
              S.SCREEN_TYPE,
              S.SCREEN_SIZE,
              S.JS_AFTER_OPEN,
              S.POSITION,
              S.PROFILES,
              S.SHOW_TITLE,
              T.EXEC_LINE,
              T.EXEC_TYPE,
              footer_sql,
              T.TILE_SIZE,
              t.content_js,
              t.custom_obj
       FROM   C7_SECS S,
              C7_SECS_MENUS M,
              C7_SECS_MS MS,
              C7_SECS_SS SS,
              C7_SECS_TILES T
      WHERE       M.MENU_ID = S.MENU_ID
              AND MS.MS_ID = S.MS_ID
              AND SS.SS_ID = S.SS_ID
              AND T.TILE_ID = S.TILE_ID
   ORDER BY   S.menu_id,
              S.MS_ID,
              S.SS_ID,
              S.TILE_ID;

DROP VIEW ACC_TRANSACTION_UP2;

/* Formatted on 21/09/2023 12:07:31 � (QP5 v5.115.810.9015) */
CREATE OR REPLACE FORCE VIEW ACC_TRANSACTION_UP2
(
   PERIODCODE,
   KEYFLD,
   NO,
   VOU_CODE,
   VOU_DATE,
   POS,
   ACCNO,
   DEBIT,
   CREDIT,
   DESCR,
   DESCR2,
   FLAG,
   USERNM,
   CREATDT,
   YEAR,
   TYPE,
   ISCHANGE,
   ISNEW,
   INVOICE_CODE,
   INVOICE_TYPE,
   INVKEYFLD,
   GRPNO,
   REFERNO,
   REFERCODE,
   REFERTYPE,
   COSTCENT,
   DUEDATE,
   CHEQUENO,
   ISCUST,
   NAMEA,
   ACNAME,
   LEVELNO,
   LASTUPDATE,
   START_DATE,
   LIMIT,
   PATH,
   PARENTACC,
   CLOSEACC,
   ACTYPE,
   USECOUNT,
   CHILDCOUNT,
   ISSUPP,
   ISSALESP,
   ISBANKCASH,
   ISEMPLOYEE,
   RCVFROM,
   GRPNAME,
   GRPNAME_A,
   STAT_NAME_1,
   STAT_NAME_2,
   CUST_CODE,
   CSNAME,
   CSCHILDCOUNT,
   CSPATH,
   CLOSEPATH
)
AS
   SELECT   ALL acvoucher2.periodcode,
                acvoucher2.keyfld,
                acvoucher2.NO,
                acvoucher2.vou_code,
                acvoucher2.vou_date,
                acvoucher2.pos,
                acvoucher2.accno,
                acvoucher2.debit,
                acvoucher2.credit,
                acvoucher2.descr,
                acvoucher2.descr2,
                acvoucher2.flag,
                acvoucher2.usernm,
                acvoucher2.creatdt,
                acvoucher2.YEAR,
                acvoucher2.TYPE,
                acvoucher2.ischange,
                acvoucher2.isnew,
                acvoucher2.invoice_code,
                acvoucher2.invoice_type,
                acvoucher2.invkeyfld,
                acvoucher2.grpno,
                acvoucher2.referno,
                acvoucher2.refercode,
                acvoucher2.refertype,
                acvoucher2.costcent,
                ACVOUCHER1.DUEDATE,
                ACVOUCHER1.CHEQUENO,
                acaccount.iscust,
                acaccount.namea,
                acaccount.name ACNAME,
                acaccount.levelno,
                acaccount.lastupdate,
                acaccount.start_date,
                acaccount.LIMIT,
                acaccount.PATH,
                acaccount.parentacc,
                acaccount.closeacc,
                acaccount.actype,
                acaccount.usecount,
                acaccount.childcount,
                acaccount.issupp,
                acaccount.issalesp,
                acaccount.isbankcash,
                acaccount.isemployee,
                ACVOUCHER1.RCVFROM,
                INITCAP (acgrpjvs.NAME) grpname,
                INITCAP (ACGRPJVS.NAMEA) GRPNAME_A,
                INITCAP (ACGRPJVS.STAT_NAME_1) STAT_NAME_1,
                INITCAP (ACGRPJVS.STAT_NAME_2) STAT_NAME_2,
                acvoucher2.cust_code,
                cc.title csname,
                cc.childcount cschildcount,
                cc.PATH cspath,
                acc2.PATH closepath
     FROM   acaccount,
            acaccount acc2,
            acvoucher2,
            acgrpjvs,
            ACVOUCHER1,
            accostcent1 cc
    WHERE       acaccount.accno = acvoucher2.accno
            AND ACVOUCHER1.KEYFLD = ACVOUCHER2.KEYFLD
            AND acvoucher2.grpno = acgrpjvs.code(+)
            AND acvoucher2.costcent = cc.code(+)
            AND acc2.accno = acaccount.closeacc;

DROP VIEW ACC_TRANSACTION_UP;

/* Formatted on 21/09/2023 12:08:34 � (QP5 v5.115.810.9015) */
CREATE OR REPLACE FORCE VIEW ACC_TRANSACTION_UP
(
   PERIODCODE,
   KEYFLD,
   NO,
   VOU_CODE,
   VOU_DATE,
   POS,
   ACCNO,
   DEBIT,
   CREDIT,
   DESCR,
   DESCR2,
   FLAG,
   USERNM,
   CREATDT,
   YEAR,
   TYPE,
   ISCHANGE,
   ISNEW,
   INVOICE_CODE,
   INVOICE_TYPE,
   INVKEYFLD,
   GRPNO,
   REFERNO,
   REFERCODE,
   REFERTYPE,
   COSTCENT,
   DUEDATE,
   CHEQUENO,
   ISCUST,
   NAMEA,
   ACNAME,
   LEVELNO,
   LASTUPDATE,
   START_DATE,
   LIMIT,
   PATH,
   PARENTACC,
   CLOSEACC,
   ACTYPE,
   USECOUNT,
   CHILDCOUNT,
   ISSUPP,
   ISSALESP,
   ISBANKCASH,
   ISEMPLOYEE,
   RCVFROM,
   GRPNAME,
   GRPNAME_A,
   STAT_NAME_1,
   STAT_NAME_2,
   CUST_CODE,
   CSNAME,
   CSCHILDCOUNT,
   CSPATH
)
AS
   SELECT   ALL acvoucher2.periodcode,
                acvoucher2.keyfld,
                acvoucher2.NO,
                acvoucher2.vou_code,
                acvoucher2.vou_date,
                acvoucher2.pos,
                acvoucher2.accno,
                acvoucher2.debit,
                acvoucher2.credit,
                acvoucher2.descr,
                acvoucher2.descr2,
                acvoucher2.flag,
                acvoucher2.usernm,
                acvoucher2.creatdt,
                acvoucher2.YEAR,
                acvoucher2.TYPE,
                acvoucher2.ischange,
                acvoucher2.isnew,
                acvoucher2.invoice_code,
                acvoucher2.invoice_type,
                acvoucher2.invkeyfld,
                acvoucher2.grpno,
                acvoucher2.referno,
                acvoucher2.refercode,
                acvoucher2.refertype,
                acvoucher2.costcent,
                ACVOUCHER1.DUEDATE,
                ACVOUCHER1.CHEQUENO,
                acaccount.iscust,
                acaccount.namea,
                acaccount.name ACNAME,
                acaccount.levelno,
                acaccount.lastupdate,
                acaccount.start_date,
                acaccount.LIMIT,
                acaccount.PATH,
                acaccount.parentacc,
                acaccount.closeacc,
                acaccount.actype,
                acaccount.usecount,
                acaccount.childcount,
                acaccount.issupp,
                acaccount.issalesp,
                acaccount.isbankcash,
                acaccount.isemployee,
                ACVOUCHER1.RCVFROM,
                INITCAP (acgrpjvs.NAME) grpname,
                INITCAP (ACGRPJVS.NAMEA) GRPNAME_A,
                INITCAP (ACGRPJVS.STAT_NAME_1) STAT_NAME_1,
                INITCAP (ACGRPJVS.STAT_NAME_2) STAT_NAME_2,
                acvoucher2.cust_code,
                cc.title csname,
                cc.childcount cschildcount,
                cc.PATH cspath
     FROM   acaccount,
            acvoucher2,
            acgrpjvs,
            ACVOUCHER1,
            accostcent1 cc
    WHERE       acaccount.accno = acvoucher2.accno
            AND ACVOUCHER1.KEYFLD = ACVOUCHER2.KEYFLD
            AND acvoucher2.grpno = acgrpjvs.code(+)
            AND acvoucher2.costcent = cc.code(+);


DROP VIEW C6_GL1;

/* Formatted on 21/09/2023 12:20:43 � (QP5 v5.115.810.9015) */
CREATE OR REPLACE FORCE VIEW C6_GL1
(
   IDNO,
   COMP_NAME,
   SPECIFICATION,
   SPECIFICATIONA,
   FILENAME,
   COMP_NAMEA,
   USERNM,
   ACCNO,
   ACNAME,
   FIELD3,
   COST_CENT,
   COST_CENT_NAME,
   RFR,
   RFR_NAME,
   FROMDATE,
   TODATE,
   ACBAL,
   B30,
   B60,
   B90,
   B120,
   B150,
   AGEING,
   ACPATH,
   NO_OF_RECS
)
AS
     SELECT   ALL TEMPORARY.IDNO,
                  company.name comp_name,
                  specification,
                  specificationa,
                  FILENAME,
                  company.namea comp_namea,
                  TEMPORARY.USERNM,
                  TEMPORARY.FIELD1 ACCNO,
                  TEMPORARY.FIELD2 ACNAME,
                  TEMPORARY.FIELD3,
                  field27 cost_cent,
                  FIELD28 COST_CENT_NAME,
                  '' rfr,
                  '' rfr_name,
                  TO_DATE (field5, 'dd/mm/rrrr') fromdate,
                  TO_DATE (field6, 'dd/mm/rrrr') todate,
                  TO_NUMBER (FIELD20) ACBAL,
                  TO_NUMBER (FIELD31) B30,
                  TO_NUMBER (FIELD32) B60,
                  TO_NUMBER (FIELD33) B90,
                  TO_NUMBER (FIELD34) B120,
                  TO_NUMBER (FIELD35) B150,
                  FIELD30 AGEING,
                  FIELD19 ACPATH,
                  TO_NUMBER (field23) no_of_recs
       FROM   TEMPORARY, COMPANY
      WHERE   IDNO = 101 AND CRNT = 'X'
   ORDER BY   FIELD19;

DROP VIEW C6_GL2;

/* Formatted on 21/09/2023 12:21:27 � (QP5 v5.115.810.9015) */
CREATE OR REPLACE FORCE VIEW C6_GL2
(
   ACCNO,
   NAME,
   VOU_DATE,
   DESCR,
   VOU_NO,
   TYPE_DESCR,
   DEBIT,
   CREDIT,
   BALANCE,
   ACPATH,
   DRTOT,
   CRTOT,
   VOU_CODE,
   VOU_TYPE,
   KEYFLD,
   POS,
   USERNM,
   COSTCENT,
   FCCODE,
   FC_AMT,
   FC_RATE,
   FC_MAIN,
   FC_MAIN_RATE,
   JVPOS
)
AS
   SELECT   field1 accno,
            field2 NAME,
            TO_DATE (field3, 'DD/MM/YYYY') vou_date,
            field9 descr,
            TO_NUMBER (field8) vou_no,
            field4 type_descr,
            TO_NUMBER (field5) debit,
            TO_NUMBER (field6) credit,
            TO_NUMBER (field7) balance,
            field19 ACPATH,
            TO_NUMBER (field12) drtot,
            TO_NUMBER (field13) crtot,
            TO_NUMBER (field21) vou_code,
            TO_NUMBER (field22) vou_type,
            TO_NUMBER (field35) keyfld,
            TO_NUMBER (field25) pos,
            usernm,
            field27 costcent,
            SUBSTR (field28, 1, 100) fccode,
            TO_NUMBER (field29) fc_amt,
            TO_NUMBER (field30) fc_rate,
            FIELD31 FC_MAIN,
            TO_NUMBER (FIELD32) FC_MAIN_RATE,
            TO_NUMBER (field33) jvpos
     FROM   TEMPORARY
    WHERE   idno = 102;

DROP VIEW C7_CUST_BAL;

/* Formatted on 21/09/2023 12:23:25 � (QP5 v5.115.810.9015) */
CREATE OR REPLACE FORCE VIEW C7_CUST_BAL
(
   CODE,
   NAME,
   SALESP,
   AREA,
   CRD_LIMIT,
   TEL,
   ADDR,
   EMAIL,
   BALANCE
)
AS
     SELECT   c_ycust.code,
              c_ycust.name,
              C_YCUST.SALESP,
              C_YCUST.AREA,
              C_YCUST.CRD_LIMIT,
              C_YCUST.TEL,
              C_YCUST.ADDR,
              C_YCUST.EMAIL,
              SUM (debit - credit) balance
       FROM   acvoucher2 v, c_ycust
      WHERE   v.cust_code = c_ycust.code
   GROUP BY   code,
              c_ycust.name,
              C_YCUST.SALESP,
              C_YCUST.AREA,
              C_YCUST.CRD_LIMIT,
              C_YCUST.TEL,
              C_YCUST.ADDR,
              C_YCUST.EMAIL;


DROP VIEW C7_GL1;

/* Formatted on 21/09/2023 12:23:25 � (QP5 v5.115.810.9015) */
CREATE OR REPLACE FORCE VIEW C7_GL1
(
   REP_COD,
   COMP_NAME,
   SPECIFICATION,
   SPECIFICATIONA,
   FILENAME,
   COMP_NAMEA,
   POS,
   ACCNO,
   ACNAME,
   ACBAL,
   USERNM
)
AS
     SELECT   FIELD1 REP_COD,
              company.name comp_name,
              specification,
              specificationa,
              FILENAME,
              company.namea comp_namea,
              TO_NUMBER (field2) pos,
              field3 accno,
              field4 acname,
              TO_NUMBER (field5) acbal,
              USERNM
       FROM   temporary, COMPANY
      WHERE   field1 = '10102-1-0' AND CRNT = 'X' AND idno = 8.1
   ORDER BY   POS;


DROP VIEW C7_GL_AC1;

/* Formatted on 21/09/2023 12:23:25 � (QP5 v5.115.810.9015) */
CREATE OR REPLACE FORCE VIEW C7_GL_AC1
(
   IDNO,
   COMP_NAME,
   SPECIFICATION,
   SPECIFICATIONA,
   FILENAME,
   COMP_NAMEA,
   USERNM,
   ACCNO,
   ACNAME,
   FIELD3,
   COST_CENT,
   COST_CENT_NAME,
   RFR,
   RFR_NAME,
   FROMDATE,
   TODATE,
   ACBAL,
   B30,
   B60,
   B90,
   B120,
   B150,
   AGEING,
   ACPATH,
   NO_OF_RECS
)
AS
     SELECT   ALL TEMPORARY.IDNO,
                  company.name comp_name,
                  specification,
                  specificationa,
                  FILENAME,
                  company.namea comp_namea,
                  TEMPORARY.USERNM,
                  TEMPORARY.FIELD1 ACCNO,
                  TEMPORARY.FIELD2 ACNAME,
                  TEMPORARY.FIELD3,
                  field27 cost_cent,
                  FIELD28 COST_CENT_NAME,
                  '' rfr,
                  '' rfr_name,
                  TO_DATE (field5, 'dd/mm/rrrr') fromdate,
                  TO_DATE (field6, 'dd/mm/rrrr') todate,
                  TO_NUMBER (FIELD20) ACBAL,
                  TO_NUMBER (FIELD31) B30,
                  TO_NUMBER (FIELD32) B60,
                  TO_NUMBER (FIELD33) B90,
                  TO_NUMBER (FIELD34) B120,
                  TO_NUMBER (FIELD35) B150,
                  FIELD30 AGEING,
                  FIELD19 ACPATH,
                  TO_NUMBER (field23) no_of_recs
       FROM   TEMPORARY, COMPANY
      WHERE   IDNO = 10101 AND CRNT = 'X'
   ORDER BY   FIELD19;


DROP VIEW C7_GL_AC2;

/* Formatted on 21/09/2023 12:23:25 � (QP5 v5.115.810.9015) */
CREATE OR REPLACE FORCE VIEW C7_GL_AC2
(
   ACCNO,
   NAME,
   VOU_DATE,
   DESCR,
   VOU_NO,
   TYPE_DESCR,
   DEBIT,
   CREDIT,
   BALANCE,
   ACPATH,
   DRTOT,
   CRTOT,
   VOU_CODE,
   VOU_TYPE,
   KEYFLD,
   POS,
   USERNM,
   COSTCENT,
   FCCODE,
   FC_AMT,
   FC_RATE,
   FC_MAIN,
   FC_MAIN_RATE,
   JVPOS,
   SUBACCNO
)
AS
     SELECT   field1 accno,
              field2 NAME,
              TO_DATE (field3, 'DD/MM/YYYY') vou_date,
              field9 descr,
              TO_NUMBER (field8) vou_no,
              field4 type_descr,
              TO_NUMBER (field5) debit,
              TO_NUMBER (field6) credit,
              TO_NUMBER (field7) balance,
              field19 ACPATH,
              TO_NUMBER (field12) drtot,
              TO_NUMBER (field13) crtot,
              TO_NUMBER (field21) vou_code,
              TO_NUMBER (field22) vou_type,
              TO_NUMBER (field35) keyfld,
              TO_NUMBER (field25) pos,
              usernm,
              field27 costcent,
              SUBSTR (field28, 1, 100) fccode,
              TO_NUMBER (field29) fc_amt,
              TO_NUMBER (field30) fc_rate,
              FIELD31 FC_MAIN,
              TO_NUMBER (FIELD32) FC_MAIN_RATE,
              TO_NUMBER (field33) jvpos,
              FIELD34 SUBACCNO
       FROM   TEMPORARY
      WHERE   idno = 10201
   ORDER BY   TO_NUMBER (FIELD25);


DROP VIEW C7_STK;

/* Formatted on 21/09/2023 12:23:25 � (QP5 v5.115.810.9015) */
CREATE OR REPLACE FORCE VIEW C7_STK
(
   KEYFLD,
   DESCR2,
   PARENTITEM,
   ORDWAS,
   INVOICE_NO,
   INVOICE_KEYFLD,
   ADDITIONAL_AMT,
   PACKAGED,
   DAT,
   INVOICE_CODE,
   INVOICE_DATE,
   TYPE,
   REFER,
   PRICE,
   ALLQTY,
   PRD_DATE,
   EXP_DATE,
   MFCODE,
   DISC_AMT,
   STRA,
   STRB,
   CTG,
   DESCR,
   ORDERNO,
   PKCOST,
   PACK,
   PACKD,
   UNITD,
   PKAVER,
   ITPACKD,
   ITEMPOS,
   ITPACK,
   ITUNITD,
   INV_REF,
   INV_REFNM,
   QTYIN,
   QTYOUT,
   DISC_AMT_GROSS,
   CODE_NAMEE,
   CODE_NAMEA,
   INV_INVOICE_CODE,
   PUR_KEYFLD,
   PUR_INV_NO,
   C_CUS_NO,
   REF_NAME
)
AS
   SELECT   invoice2.keyfld,
            items.descr2,
            items.parentitem,
            ordwas,
            invoice2.invoice_no,
            invoice_keyfld,
            invoice2.additional_amt,
            invoice2.packaged,
            invoice2.dat,
            invoice2.TYPE invoice_code,
            dat invoice_date,
            invoice2.invoice_type TYPE,
            invoice2.refer,
            invoice2.price,
            invoice2.allqty + invoice2.free_allqty allqty,
            invoice2.prd_date,
            invoice2.exp_date,
            items.mfcode,
            invoice2.disc_amt,
            invoice2.stra,
            invoice2.strb,
            items.ctg,
            items.descr,
            invoice2.orderno,
            invoice2.pkcost,
            invoice2.pack,
            invoice2.packd,
            invoice2.unitd,
            items.pkaver,
            items.packd itpackd,
            invoice2.itempos,
            items.pack itpack,
            items.unitd itunitd,
            '' INV_REF,
            '' INV_REFNM,
            invoice2.qtyin,
            invoice2.qtyout,
            disc_amt_gross,
            (SHORT_NAME) CODE_NAMEE,
            SHORT_NAME_A CODE_NAMEA,
            INVOICE2.INVOICE_CODE INV_INVOICE_CODE,
            pur.keyfld pur_keyfld,
            pur.invoice_no pur_inv_no,
            pur.c_cus_no,
            pur.inv_refnm ref_name
     FROM   invoice2,
            items,
            invoice_codes,
            (  SELECT   invoice_no,
                        keyfld,
                        c_cus_no,
                        inv_refnm
                 FROM   pur1
             ORDER BY   keyfld) pur
    WHERE       items.REFERENCE = invoice2.refer
            AND CODE = invoice2.TYPE
            AND invoice2.invoice_keyfld = pur.keyfld(+);


DROP VIEW C7_V_ACC_BALANCE_1;

/* Formatted on 21/09/2023 12:23:25 � (QP5 v5.115.810.9015) */
CREATE OR REPLACE FORCE VIEW C7_V_ACC_BALANCE_1
(
   ACCNO,
   NAME,
   NAMEA,
   PATH,
   DEBIT,
   CREDIT,
   LEVELNO,
   CHILDCOUNT,
   ISCUST,
   START_DATE,
   LIMIT,
   COSTCENT,
   FLAG,
   TYPE,
   PARENTACC
)
AS
     SELECT   ALL acaccount.accno,
                  acaccount.NAME,
                  acaccount.namea,
                  acaccount.PATH,
                  NVL (SUM (acvoucher2.debit), 0) debit,
                  NVL (SUM (acvoucher2.credit), 0) credit,
                  levelno,
                  childcount,
                  acaccount.iscust,
                  acaccount.start_date,
                  ACACCOUNT.CRD_LIMIT LIMIT,
                  acaccount.costcent,
                  acaccount.flag,
                  acaccount.TYPE,
                  acaccount.PARENTACC
       FROM   acaccount, acvoucher2
      WHERE   (acvoucher2.accno = acaccount.accno) AND ACVOUCHER2.FLAG = 2
   GROUP BY   acaccount.accno,
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
              ACACCOUNT.CRD_LIMIT,
              acaccount.PARENTACC;
