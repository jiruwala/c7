SET DEFINE OFF;
Insert into ACACCOUNT
   (ACCNO, GRPNO, NAME, NAMEA, ISCUST, LEVELNO, BEG_DRBAL, BEG_CRBAL, BEG_DRBALFC, BEG_CRBALFC, START_DATE, LASTUPDATE, LIMIT, COSTCENT, FLAG, TYPE, DEP_ACC, DEP_EXP, DEP_RATE, ISCHANGE, ISNEW, SUBGRP, KEYFLD, PATH, PARENTACC, TREELEVEL, CLOSEACC, ACTYPE, USECOUNT, CHILDCOUNT, ISSUPP, ISSALESP, ISBANKCASH, ISEMPLOYEE, FULL_ADDR, COUNTRY, AREA, CITY, TEL, FAX, REFERENCE_NAME, REFERENCE_TITLE, REFERENCE_TEL, EMAIL_ADDR, BANK_DETAILS, PAYMENT_TERMS, REMARKS, INVFLAG, CRD_LIMIT, DEFAULT_PRICE, ISFIXED, IS_ITEM_DISC_ALLOWED, IS_INV_DISC_ALLOWED, POSFLAG, BRANCHNO, CURRENCY_CODE, INV_DUE_DAYS, AC_NATURE, MOTHERCUST)
 Values
   ('91', NULL, 'PL', NULL, 
    'N', 2, 0, 0, 0, 
    0, TO_DATE('09/21/2023 00:00:00', 'MM/DD/YYYY HH24:MI:SS'), NULL, 0, NULL, 
    1, 1, NULL, NULL, 1, 
    'Y', 'Y', NULL, NULL, 'XXX\9\91\', 
    '9', 1, NULL, 1, 0, 
    0, 'N', 'N', 'N', 'N', 
    NULL, NULL, NULL, NULL, NULL, 
    NULL, NULL, NULL, NULL, NULL, 
    NULL, NULL, NULL, 1, 0, 
    0, 'N', 'N', 'N', '00', 
    NULL, 'K.D.', 0, 1, NULL);
COMMIT;

update acaccount set closeacc='91' where accno like '4%';

ALTER TABLE CND2.ACACCOUNT
 ADD (USERNM  VARCHAR2(100)                         DEFAULT 'A'                  NOT NULL
 ); 

ALTER TABLE CND2.ACACCOUNT
ADD ( CREATDT               DATE);

