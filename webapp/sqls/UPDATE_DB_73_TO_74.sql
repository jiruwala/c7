CREATE TABLE C7BR.PORD1
(
  PERIODCODE          VARCHAR2(50 BYTE)         NOT NULL,
  ORD_NO              NUMBER(16)                NOT NULL,
  ORD_CODE            NUMBER(5)                 NOT NULL,
  ORD_REF             VARCHAR2(50 BYTE)         NOT NULL,
  ORD_REFNM           VARCHAR2(255 BYTE),
  ORD_DATE            DATE                      NOT NULL,
  ORD_SHIP            VARCHAR2(100 BYTE),
  ORD_SHPDT           DATE,
  ORD_AMT             NUMBER                    DEFAULT 0                     NOT NULL,
  ORD_DISCAMT         NUMBER                    DEFAULT 0,
  ORD_FLAG            NUMBER(5)                 DEFAULT 1                     NOT NULL,
  ORD_EMPNO           NUMBER(10),
  YEAR                VARCHAR2(4 BYTE)          DEFAULT '2000'                NOT NULL,
  REMARKS             VARCHAR2(100 BYTE),
  PAYTERM             VARCHAR2(50 BYTE),
  VALIDATIY           VARCHAR2(100 BYTE),
  ATTN                VARCHAR2(100 BYTE),
  KEYFLD              NUMBER,
  DELIVEREDQTY        NUMBER                    DEFAULT 0                     NOT NULL,
  ORDERDQTY           NUMBER                    DEFAULT 0                     NOT NULL,
  SALEINV             NUMBER,
  ONAME               VARCHAR2(100 BYTE),
  LOCATION_CODE       VARCHAR2(100 BYTE)        DEFAULT '001'                 NOT NULL,
  COSTCENT            VARCHAR2(100 BYTE),
  ORD_TYPE            NUMBER                    DEFAULT 1                     NOT NULL,
  RECIPT_KEYFLD       NUMBER,
  PUR_KEYFLD          NUMBER,
  LCNO                VARCHAR2(100 BYTE),
  ORDACC              VARCHAR2(255 BYTE),
  APPROVED_BY         VARCHAR2(100 BYTE),
  APPROVED_TIME       DATE,
  LAST_MODIFIED_TIME  DATE,
  LAST_MODIFYED_BY    VARCHAR2(100 BYTE),
  DELIVERED_FREEQTY   NUMBER                    DEFAULT 0                     NOT NULL,
  PUR_ADJUST_KEYFLD   NUMBER,
  HAVE_ADJUSTMENT     VARCHAR2(100 BYTE)        DEFAULT 'N'                   NOT NULL,
  ADJUST_AMOUNT       NUMBER                    DEFAULT 0                     NOT NULL,
  ADJUST_CURRENCY     VARCHAR2(100 BYTE)        DEFAULT 'KWD'                 NOT NULL,
  ADJUST_RATE         NUMBER                    DEFAULT 1                     NOT NULL,
  ADJUST_DATE         DATE,
  ADJUST_DESCR        VARCHAR2(255 BYTE),
  PUR_AND_SRV         VARCHAR2(10 BYTE)         DEFAULT 'N'                   NOT NULL,
  STRA                NUMBER,
  SAL_AND_ISS         VARCHAR2(10 BYTE)         DEFAULT 'N'                   NOT NULL,
  ISSUE_KEYFLD        NUMBER,
  ORD_REFERENCE       NUMBER,
  ORD_FC_RATE         NUMBER                    DEFAULT 1                     NOT NULL,
  ORD_FC_DESCR        VARCHAR2(100 BYTE)        DEFAULT 'KWD'                 NOT NULL,
  PAY_KEYFLD          VARCHAR2(500 BYTE),
  SALERET_KEYFLD      NUMBER,
  SALERET             VARCHAR2(3 BYTE)          DEFAULT 'N'                   NOT NULL,
  ORD_TXT_WO          VARCHAR2(100 BYTE),
  ORD_TXT_IID         VARCHAR2(100 BYTE),
  ORD_ADDAMT          NUMBER                    DEFAULT 0                     NOT NULL,
  STRB                NUMBER,
  REFERENCE           VARCHAR2(255 BYTE),
  ATTACHMENT          VARCHAR2(500 BYTE),
  CREATED_TIME        DATE,
  USERNM              VARCHAR2(100 BYTE),
  MODIFIED_TIME       DATE
)
TABLESPACE USERS
PCTUSED    0
PCTFREE    10
INITRANS   1
MAXTRANS   255
STORAGE    (
            INITIAL          3M
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


CREATE TABLE C7BR.PORD2
(
  PERIODCODE         VARCHAR2(50 BYTE)          NOT NULL,
  ORD_NO             NUMBER(16)                 NOT NULL,
  ORD_CODE           NUMBER(5)                  NOT NULL,
  ORD_POS            NUMBER                     NOT NULL,
  ORD_DATE           DATE                       NOT NULL,
  ORD_REFER          VARCHAR2(35 BYTE)          NOT NULL,
  ORD_PRICE          NUMBER                     DEFAULT 0                     NOT NULL,
  ORD_ITMAVER        NUMBER                     DEFAULT 0                     NOT NULL,
  ORD_PKQTY          NUMBER                     DEFAULT 0,
  ORD_UNQTY          NUMBER                     DEFAULT 0                     NOT NULL,
  ORD_ALLQTY         NUMBER                     DEFAULT 0                     NOT NULL,
  ORD_PACK           NUMBER                     DEFAULT 1                     NOT NULL,
  ORD_PACKD          VARCHAR2(100 BYTE)         DEFAULT 'PCS'                 NOT NULL,
  ORD_UNITD          VARCHAR2(100 BYTE)         DEFAULT 'PCS',
  ORD_DISCAMT        NUMBER                     DEFAULT 0,
  ORD_FLAG           NUMBER(5)                  DEFAULT 1                     NOT NULL,
  YEAR               VARCHAR2(4 BYTE)           DEFAULT '2000'                NOT NULL,
  DESCR              VARCHAR2(100 BYTE),
  KEYFLD             NUMBER,
  DELIVEREDQTY       NUMBER                     DEFAULT 0                     NOT NULL,
  SALEINV            NUMBER,
  ORD_REQ_DATE       DATE,
  LOCATION_CODE      VARCHAR2(100 BYTE)         DEFAULT '001'                 NOT NULL,
  COSTCENT           VARCHAR2(100 BYTE),
  ORDEREDQTY         NUMBER                     DEFAULT 0                     NOT NULL,
  RECIPT_KEYFLD      NUMBER,
  PUR_KEYFLD         NUMBER,
  LCNO               VARCHAR2(100 BYTE),
  ORD_FREEQTY        NUMBER                     DEFAULT 0                     NOT NULL,
  ORD_FREEPKQTY      NUMBER                     DEFAULT 0                     NOT NULL,
  ORD_FREEALLQTY     NUMBER                     DEFAULT 0                     NOT NULL,
  DELIVERED_FREEQTY  NUMBER                     DEFAULT 0                     NOT NULL,
  ORD_TYPE           NUMBER                     DEFAULT 1                     NOT NULL,
  ORD_COST_PRICE     NUMBER                     DEFAULT 0                     NOT NULL,
  ISSUE_KEYFLD       NUMBER,
  DIV_CODE           VARCHAR2(100 BYTE),
  DIV_RATE           NUMBER                     DEFAULT 1                     NOT NULL,
  ORD_FC_RATE        NUMBER                     DEFAULT 1                     NOT NULL,
  ORD_FC_DESCR       VARCHAR2(100 BYTE)         DEFAULT 'KWD'                 NOT NULL,
  ORD_RCPTNO         VARCHAR2(500 BYTE),
  ORD_U_COST         NUMBER,
  PO_SR_NO           NUMBER,
  ISSUED_QTY         NUMBER                     DEFAULT 0                     NOT NULL,
  PAYMENT_REFERENCE  NUMBER,
  SALERET_QTY        NUMBER                     DEFAULT 0                     NOT NULL,
  PURRET_QTY         NUMBER                     DEFAULT 0                     NOT NULL,
  SALERET_KEYFLD     NUMBER,
  ITEM_COLOR         VARCHAR2(100 BYTE),
  ITEM_SIZE          VARCHAR2(100 BYTE),
  ADD_WORK           VARCHAR2(255 BYTE),
  RECTO_VERSO        VARCHAR2(255 BYTE),
  SRNO               VARCHAR2(255 BYTE),
  PAGES              VARCHAR2(255 BYTE),
  SECTION            VARCHAR2(255 BYTE),
  MACHINE            VARCHAR2(255 BYTE),
  MATERIAL           VARCHAR2(255 BYTE),
  STRA               NUMBER
)
TABLESPACE USERS
PCTUSED    0
PCTFREE    10
INITRANS   1
MAXTRANS   255
STORAGE    (
            INITIAL          5M
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


SET DEFINE OFF;
DELETE FROM C7BR.CP_USER_PROFILES WHERE VARIABLE='C7_VER_NO';

Insert into C7BR.CP_USER_PROFILES
   (VARIABLE, PROFILENO, VALUE, TYPEOPARAM)
 Values
   ('C7_VER_NO', 0, '7.4', 1);
COMMIT;


SET DEFINE OFF;
Insert into C7BR.C7_NOTIFY_SETUP_ITEMS
   (KEYFLD, GROUP_CODE, SETUP_TYPE, SETUP_TITLE, CONDITION_STR, CMD, DESCR_STR, DEL_ON_CLICK, MULTI_SELECT)
 Values
   (80, '102', 'PO_APPROVE', 'New PO to Approve', 'PO', 'bin.forms.pur.po formType=dialog status=view keyfld=VAR_PARA_3', 'New PO to Approve VAR_PARA_1', 'N', 'N');
COMMIT;


CREATE UNIQUE INDEX C7BR.PK_PORD1 ON C7BR.PORD1
(PERIODCODE, ORD_NO, ORD_CODE)
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


CREATE UNIQUE INDEX C7BR.PORD2_PK ON C7BR.PORD2
(PERIODCODE, ORD_NO, ORD_CODE, ORD_POS, LOCATION_CODE)
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


CREATE UNIQUE INDEX C7BR.UK_PORD1 ON C7BR.PORD1
(KEYFLD)
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


ALTER TABLE C7BR.PORD1 ADD (
  CONSTRAINT PK_PORD1
 PRIMARY KEY
 (PERIODCODE, ORD_NO, ORD_CODE)
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
               ),
  CONSTRAINT UK_PORD1
 UNIQUE (KEYFLD)
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

ALTER TABLE C7BR.PORD2 ADD (
  CONSTRAINT PORD2_PK
 PRIMARY KEY
 (PERIODCODE, ORD_NO, ORD_CODE, ORD_POS, LOCATION_CODE)
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


--C7.PO1

SET DEFINE OFF;
Insert into C7BR.CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, DEFAULT_VALUE, MULTISELECT)
 Values
   (0, 'C7.PO1', 'ORD_POS', 'NONE', 50, 'SN', 20, 'Y', 'ALIGN_LEFT', 'NONE', 'TEXTFIELD', '#AUTONUMBER_', 'N');
Insert into C7BR.CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, LOV_SQL, LOOKUP_COLUMN, RETURN_VALUES, VALIDATE_EVENT, MULTISELECT)
 Values
   (0, 'C7.PO1', 'ORD_REFER', 'NONE', 120, 'itemCode', 30, 'Y', 'ALIGN_LEFT', 'NONE', 'TEXTFIELD', 'SELECT REFERENCE,DESCR FROM ITEMS WHERE FLAG=1 ORDER BY DESCR2', 'REFERENCE,DESCR', 'ORD_REFER=REFERENCE,DESCR=DESCR', 'oModel.setProperty(currentRowoIndexContext.sPath + ''/DESCR'', "");
var sq = Util.getSQLValue(''select descr from items where reference='' + :newValue );
var child = Util.getSQLValue(''select childcounts from items where reference='' + :newValue );
var packd=Util.getSQLValue(''select packd from items where reference='' + :newValue );
var unitd=Util.getSQLValue(''select unitd from items where reference='' + :newValue );
var pack=Util.getSQLValue(''select pack from items where reference='' + :newValue );

if (child>0) {
 sap.m.MessageToast.show(''Err ! , Cant select group item here..'');
}


oModel.setProperty(currentRowoIndexContext.sPath + ''/DESCR'', sq);
oModel.setProperty(currentRowoIndexContext.sPath + ''/ORD_PACKD'', packd);
oModel.setProperty(currentRowoIndexContext.sPath + ''/ORD_UNITD'', unitd);
oModel.setProperty(currentRowoIndexContext.sPath + ''/ORD_PACK'', pack);
oModel.setProperty(currentRowoIndexContext.sPath + ''/ORD_PRICE'',0);
oModel.setProperty(currentRowoIndexContext.sPath + ''/AMOUNT'',0);', 'N');
Insert into C7BR.CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, MULTISELECT)
 Values
   (0, 'C7.PO1', 'DESCR', 'NONE', 250, 'descrTxt', 40, 'Y', 'ALIGN_LEFT', 'NONE', 'TEXTFIELD', 'N');
Insert into C7BR.CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, MULTISELECT)
 Values
   (0, 'C7.PO1', 'ORD_PACKD', 'NONE', 60, 'itemPackD', 50, 'Y', 'ALIGN_LEFT', 'NONE', 'LABEL', 'N');
Insert into C7BR.CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, MULTISELECT)
 Values
   (0, 'C7.PO1', 'ORD_UNITD', 'NONE', 60, 'itemUnitD', 60, 'Y', 'ALIGN_LEFT', 'NONE', 'LABEL', 'N');
Insert into C7BR.CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, MULTISELECT)
 Values
   (0, 'C7.PO1', 'ORD_PACK', 'NONE', 60, 'itemPack', 70, 'Y', 'ALIGN_LEFT', 'NONE', 'LABEL', 'N');
Insert into C7BR.CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, VALIDATE_EVENT, MULTISELECT)
 Values
   (0, 'C7.PO1', 'ORD_PKQTY', 'NONE', 70, 'itemPackQty', 80, 'Y', 'ALIGN_LEFT', 'QTY_FORMAT', 'TEXTFIELD', 'var pqt= parseFloat( :nwValue.replace(/[^\d\.]/g, ''''));
var qt= parseFloat(oModel.getProperty(currentRowoIndexContext.sPath + ''/ORD_UNQTY''));
var pr = parseFloat(oModel.getProperty(currentRowoIndexContext.sPath + ''/ORD_PRICE''));
var pk = parseFloat(oModel.getProperty(currentRowoIndexContext.sPath + ''/ORD_PACK''));

var amt=pr*((pk*pqt)+qt);
oModel.setProperty(currentRowoIndexContext.sPath + ''/AMOUNT'',df.format(amt));
/*table.view.do_summary(false);*/
1==1;', 'N');
Insert into C7BR.CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, VALIDATE_EVENT, MULTISELECT)
 Values
   (0, 'C7.PO1', 'ORD_UNQTY', 'NONE', 100, 'itemUnitQty', 90, 'Y', 'ALIGN_LEFT', 'QTY_FORMAT', 'TEXTFIELD', 'var qt= parseFloat( :nwValue.replace(/[^\d\.]/g, ''''));
var pqt = parseFloat(oModel.getProperty(currentRowoIndexContext.sPath + ''/ORD_PKQTY''));
var pr = parseFloat(oModel.getProperty(currentRowoIndexContext.sPath + ''/ORD_PRICE''));
var pk = parseFloat(oModel.getProperty(currentRowoIndexContext.sPath + ''/ORD_PACK''));

var amt=pr*((pk*pqt)+qt);
oModel.setProperty(currentRowoIndexContext.sPath + ''/AMOUNT'',df.format(amt));
/*table.view.do_summary(false);*/
1==1;', 'N');
Insert into C7BR.CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, VALIDATE_EVENT, MULTISELECT)
 Values
   (0, 'C7.PO1', 'ORD_PRICE', 'NONE', 100, 'txtPrice', 100, 'Y', 'ALIGN_LEFT', 'NONE', 'TEXTFIELD', 'var pr= parseFloat( :nwValue.replace(/[^\d\.]/g, ''''));
var pqt = parseFloat(oModel.getProperty(currentRowoIndexContext.sPath + ''/ORD_PKQTY''));
var qt = parseFloat(oModel.getProperty(currentRowoIndexContext.sPath + ''/ORD_UNQTY''));
var pk = parseFloat(oModel.getProperty(currentRowoIndexContext.sPath + ''/ORD_PACK''));

var amt=pr*((pk*pqt)+qt);
oModel.setProperty(currentRowoIndexContext.sPath + ''/AMOUNT'',df.format(amt));
/*table.view.do_summary(false);*/
1==1;', 'N');
Insert into C7BR.CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, MULTISELECT)
 Values
   (0, 'C7.PO1', 'AMOUNT', 'NONE', 80, 'amountTxt', 110, 'Y', 'ALIGN_LEFT', 'MONEY_FORMAT', 'LABEL', 'N');
COMMIT;
