SET DEFINE OFF;

UPDATE C76EUR.ITEMS
SET ITPRICE4=0 ,KEYFLD=ROWNUM;

Insert into CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, DEFAULT_VALUE, MULTISELECT)
 Values
   (0, 'C7.OP1', 'ITEMPOS', 'NONE', 50, 'itemPos', 10, 'Y', 'ALIGN_LEFT', 'NONE', 'TEXTFIELD', '#AUTONUMBER_', 'N');
Insert into CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, LOV_SQL, LOOKUP_COLUMN, RETURN_VALUES, VALIDATE_EVENT, MULTISELECT)
 Values
   (0, 'C7.OP1', 'REFER', 'NONE', 120, 'itemCode', 20, 'Y', 'ALIGN_LEFT', 'NONE', 'TEXTFIELD', 'SELECT REFERENCE,DESCR FROM ITEMS WHERE FLAG=1 ORDER BY DESCR2', 'REFERENCE,DESCR', 'REFER=REFERENCE,DESCRX=DESCR', 'var sfd = new simpleDateFormat(sett[''ENGLISH_DATE_FORMAT'']);

var pqt= Util.extractNumber(oModel.getProperty(currentRowoIndexContext.sPath + ''/PKQTY''));
var qt= Util.extractNumber(oModel.getProperty(currentRowoIndexContext.sPath + ''/QTY''));

var odt=Util.toOraDateString(frag.getFieldValue(''qry1.invoice_date''));
var str=frag.getFieldValue(''qry1.stra'');
if (Util.nvl(str,undefined)==undefined) FormView.err("Store Out must select !");

var excFld=''"''+frag.getFieldValue(''qry1.keyfld'')+''"'';

var sqdt=Util.execSQLWithData(''select descr,childcounts,packd,unitd,pack,get_item_cost(reference,''+odt+'') ucost,lsprice,prd_dt,exp_dt from items where reference=''+:newValue);

var sq = '''';
var child = 0;
var packd='''';
var unitd='''';
var pack=1;
var pcost=0;
var cstamt=0;
var prd_dt=undefined;
var exp_dt=undefined;
var bal=0;
var qih=0;
var price=0;
console.log(sqdt);

if (sqdt.length>0) {

 sq = sqdt[0].DESCR;
 child = sqdt[0].CHILDCOUNTS;
 packd=sqdt[0].PACKD;
 unitd=sqdt[0].UNITD;
 pack=sqdt[0].PACK;
 pcost=sqdt[0].UCOST*pack;
 cstamt=pcost*((pqt*pack)+qt);
 prd_dt=sqdt[0].PRD_DT;
 exp_dt=sqdt[0].EXP_DT;
 
}
if (child>0) {
 sap.m.MessageToast.show(''Err ! , Cant select group item here..'');
}


oModel.setProperty(currentRowoIndexContext.sPath + ''/DESCRX'', sq);
oModel.setProperty(currentRowoIndexContext.sPath + ''/PACKD'', packd);
oModel.setProperty(currentRowoIndexContext.sPath + ''/UNITD'', unitd);
oModel.setProperty(currentRowoIndexContext.sPath + ''/PACK'', pack);
oModel.setProperty(currentRowoIndexContext.sPath + ''/PRICE'',pcost);
oModel.setProperty(currentRowoIndexContext.sPath + ''/AMOUNT'',cstamt);
oModel.setProperty(currentRowoIndexContext.sPath + ''/PRD_BATCH'','''');
oModel.setProperty(currentRowoIndexContext.sPath + ''/PKCOST'',(pcost/pack));
oModel.setProperty(currentRowoIndexContext.sPath + ''/PRICE'',(pcost/pack));

if (prd_dt!=undefined) {
 var dt=new Date(prd_dt.replaceAll(''.'','':''));
 oModel.setProperty(currentRowoIndexContext.sPath + ''/PRD_DATE2'',sfd.format(dt));
 console.log(new Date(prd_dt.replaceAll(''.'','':'')));
 }
 
if (exp_dt!=undefined) { 
 var dt=new Date(exp_dt.replaceAll(''.'','':''));
 oModel.setProperty(currentRowoIndexContext.sPath + ''/EXP_DATE2'',sfd.format(dt));
 console.log(new Date(exp_dt.replaceAll(''.'','':'')));
 } 
', 'N');
Insert into CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, MULTISELECT)
 Values
   (0, 'C7.OP1', 'DESCRX', 'NONE', 220, 'descrTxt', 30, 'Y', 'ALIGN_LEFT', 'NONE', 'LABEL', 'N');
Insert into CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, MULTISELECT)
 Values
   (0, 'C7.OP1', 'PACKD', 'NONE', 60, 'itemPackD', 40, 'Y', 'ALIGN_LEFT', 'NONE', 'LABEL', 'N');
Insert into CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, MULTISELECT)
 Values
   (0, 'C7.OP1', 'UNITD', 'NONE', 60, 'itemUnitD', 50, 'Y', 'ALIGN_LEFT', 'NONE', 'LABEL', 'N');
Insert into CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, MULTISELECT)
 Values
   (0, 'C7.OP1', 'PACK', 'NONE', 50, 'itemPack', 60, 'Y', 'ALIGN_LEFT', 'QTY_FORMAT', 'LABEL', 'N');
Insert into CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, VALIDATE_EVENT, MULTISELECT)
 Values
   (0, 'C7.OP1', 'PKQTY', 'NONE', 100, 'itemPackQty', 70, 'Y', 'ALIGN_LEFT', 'QTY_FORMAT', 'TEXTFIELD', 'var pqt=Util.extractNumber( :nwValue.replace(/[^\d\.]/g, ''''));

var qt= Util.extractNumber(oModel.getProperty(currentRowoIndexContext.sPath + ''/QTY''));
var pk = Util.extractNumber(oModel.getProperty(currentRowoIndexContext.sPath + ''/PACK''));
var cst = Util.extractNumber(oModel.getProperty(currentRowoIndexContext.sPath + ''/PKCOST''));

var cstamt=(cst)*((pk*pqt)+qt);

oModel.setProperty(currentRowoIndexContext.sPath + ''/AMOUNT'',df.format(cstamt));
/*table.view.do_summary(false);*/
1==1;', 'N');
Insert into CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, VALIDATE_EVENT, MULTISELECT)
 Values
   (0, 'C7.OP1', 'QTY', 'NONE', 100, 'itemUnitQty', 80, 'Y', 'ALIGN_LEFT', 'QTY_FORMAT', 'TEXTFIELD', 'var qt= Util.extractNumber( :nwValue.replace(/[^\d\.]/g, ''''));
var pqt = Util.extractNumber(oModel.getProperty(currentRowoIndexContext.sPath + ''/PKQTY''));
var pr = Util.extractNumber(oModel.getProperty(currentRowoIndexContext.sPath + ''/PRICE''));
var pk = Util.extractNumber(oModel.getProperty(currentRowoIndexContext.sPath + ''/PACK''));


var cst = Util.extractNumber(oModel.getProperty(currentRowoIndexContext.sPath + ''/PKCOST''));

var cstamt=(cst)*((pk*pqt)+qt);

oModel.setProperty(currentRowoIndexContext.sPath + ''/AMOUNT'',df.format(cstamt));

/*table.view.do_summary(false);*/
1==1;', 'N');
Insert into CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, VALIDATE_EVENT, MULTISELECT)
 Values
   (0, 'C7.OP1', 'PRICE', 'NONE', 100, 'itemPackCost', 90, 'Y', 'ALIGN_LEFT', 'NONE', 'TEXTFIELD', 'var qt= Util.extractNumber(oModel.getProperty(currentRowoIndexContext.sPath + ''/QTY''));
var pqt = Util.extractNumber(oModel.getProperty(currentRowoIndexContext.sPath + ''/PKQTY''));
var pr = Util.extractNumber(oModel.getProperty(currentRowoIndexContext.sPath + ''/PRICE''));
var pk = Util.extractNumber(oModel.getProperty(currentRowoIndexContext.sPath + ''/PACK''));


var cst = Util.extractNumber(oModel.getProperty(currentRowoIndexContext.sPath + ''/PKCOST''));

var cstamt=(pr/pk)*((pk*pqt)+qt);

oModel.setProperty(currentRowoIndexContext.sPath + ''/AMOUNT'',df.format(cstamt));
oModel.setProperty(currentRowoIndexContext.sPath + ''/PKCOST'',pr/pk);

/*table.view.do_summary(false);*/
1==1;', 'N');
Insert into CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, MULTISELECT)
 Values
   (0, 'C7.OP1', 'PRD_BATCH', 'INVISIBLE', 160, 'itemProdBatch', 100, 'Y', 'ALIGN_LEFT', 'NONE', 'LABEL', 'N');
Insert into CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, MULTISELECT)
 Values
   (0, 'C7.OP1', 'AMOUNT', 'NONE', 120, 'itemCostAmt', 110, 'Y', 'ALIGN_LEFT', 'MONEY_FORMAT', 'LABEL', 'N');
Insert into CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, MULTISELECT)
 Values
   (0, 'C7.OP1', 'PRD_DATE2', 'INVISIBLE', 140, 'itemProdDate', 150, 'Y', 'ALIGN_LEFT', 'NONE', 'LABEL', 'N');
Insert into CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, MULTISELECT)
 Values
   (0, 'C7.OP1', 'EXP_DATE2', 'INVISIBLE', 150, 'itemExpDate', 150, 'Y', 'ALIGN_LEFT', 'NONE', 'LABEL', 'N');
Insert into CP_SETCOLS
   (PROFILE, SETGRPCODE, ITEM_NAME, DISPLAY_TYPE, DISPLAY_WIDTH, DESCR, POSITION, GETFOCUS, ALIGN, USE_FORMAT, EDITOR_CLASS, MULTISELECT)
 Values
   (0, 'C7.OP1', 'PKCOST', 'INVISIBLE', 0, 'itemUnitCost', 200, 'Y', 'ALIGN_LEFT', 'NONE', 'LABEL', 'N');
COMMIT;


ALTER TABLE PUR2
ADD PRD_BATCH        VARCHAR2(255 BYTE);

ALTER TABLE INVOICE2
ADD PO_POSNO NUMBER;

/* Formatted on 04/08/2025 04:33:39 ã (QP5 v5.115.810.9015) */
CREATE OR REPLACE FORCE VIEW C76EUR.JOINED_PORD
(
   PERIODCODE,
   ORD_NO,
   ORD_CODE,
   ORD_POS,
   ORD_DATE,
   ORD_REFER,
   ORD_PRICE,
   ORD_ITMAVER,
   ORD_PKQTY,
   ORD_UNQTY,
   ORD_ALLQTY,
   ORD_PACK,
   ORD_PACKD,
   ORD_UNITD,
   ORD_DISCAMT,
   YEAR,
   DESCR,
   KEYFLD,
   DELIVEREDQTY,
   SALEINV,
   ORD_REQ_DATE,
   LOCATION_CODE,
   COSTCENT,
   ORDEREDQTY,
   RECIPT_KEYFLD,
   PUR_KEYFLD,
   LCNO,
   ORD_FREEQTY,
   ORD_FREEPKQTY,
   ORD_FREEALLQTY,
   DELIVERED_FREEQTY,
   ORD_TYPE,
   ORD_RCPTNO,
   ORDACC,
   ORD_REF,
   ORD_REFNM,
   NAME,
   MFCODE,
   DESCR_1,
   PARENTITEMDESCR,
   PARENTITEM,
   ONAME,
   ORD_REFERENCE,
   ISSUED_QTY,
   DESCR2,
   ORD_FLAG,
   RESERVED_STOCK,
   ORD_TXT_WO,
   ORD_TXT_IID,
   ORD_FC_RATE,
   ORD_SHIP,
   SALERET_QTY,
   PURRET_QTY,
   SALERET_KEYFLD
)
AS
   SELECT   PORD2."PERIODCODE",
            PORD2."ORD_NO",
            PORD2."ORD_CODE",
            PORD2."ORD_POS",
            PORD2."ORD_DATE",
            PORD2."ORD_REFER",
            PORD2."ORD_PRICE",
            PORD2."ORD_ITMAVER",
            PORD2."ORD_PKQTY",
            PORD2."ORD_UNQTY",
            PORD2."ORD_ALLQTY",
            PORD2."ORD_PACK",
            PORD2."ORD_PACKD",
            PORD2."ORD_UNITD",
            PORD2."ORD_DISCAMT",
            PORD2."YEAR",
            PORD2."DESCR",
            PORD2."KEYFLD",
            PORD2."DELIVEREDQTY",
            PORD2."SALEINV",
            PORD2."ORD_REQ_DATE",
            PORD2."LOCATION_CODE",
            PORD2."COSTCENT",
            PORD2."ORDEREDQTY",
            PORD2."RECIPT_KEYFLD",
            PORD2."PUR_KEYFLD",
            PORD2."LCNO",
            PORD2."ORD_FREEQTY",
            PORD2."ORD_FREEPKQTY",
            PORD2."ORD_FREEALLQTY",
            PORD2."DELIVERED_FREEQTY",
            PORD2."ORD_TYPE",
            PORD2."ORD_RCPTNO",
            PORD1.ORDACC,
            PORD1.ORD_REF,
            PORD1.ord_refnm,
            locations.name,
            items.mfcode,
            items.descr DESCR_1,
            items2.descr parentitemdescr,
            items.parentitem,
            PORD1.oname,
            PORD1.ord_reference,
            PORD2.ISSUED_QTY,
            ITEMS.DESCR2,
            PORD1.ORD_FLAG,
            0 reserved_stock,
            PORD1.ORD_TXT_WO,
            PORD1.ORD_TXT_IID,
            PORD2.ORD_FC_RATE,
            PORD1.ord_ship,
            PORD2.SALERET_QTY,
            PORD2.PURRET_QTY,
            PORD2.SALERET_KEYFLD
     FROM   PORD2,
            PORD1,
            locations,
            items,
            items items2
    WHERE       PORD2.KEYFLD = PORD1.KEYFLD
            AND PORD1.location_code = locations.code
            AND PORD2.ord_refer = items.reference
            AND items2.reference(+) = items.parentitem;

/* Formatted on 04/08/2025 05:00:13 ã (QP5 v5.115.810.9015) */
CREATE OR REPLACE FORCE VIEW C76EUR.JOINED_INVOICE
(
   LOCATION_NAME,
   KEYFLD,
   DESCR2,
   PARENTITEM,
   PARENTITEMDESCR,
   ORDWAS,
   ADDITIONAL_AMT,
   PACKAGED,
   ORDNO,
   INVOICE_NO,
   DAT,
   INVOICE_CODE,
   INV_REF,
   INV_REFNM,
   CURRENCY,
   INVOICE_DATE,
   RATE,
   TYPE,
   REFER,
   SLSMN,
   PRICE,
   ALLQTY,
   PRD_DATE,
   EXP_DATE,
   MFCODE,
   DISC_AMT,
   STRA,
   LPNO,
   LPDATE,
   STRB,
   CTG,
   QTYDENIED,
   DESCR,
   DESCRA,
   ORDERNO,
   PKCOST,
   PACK,
   PACKD,
   PKAVER,
   ITPACKD,
   ITEMPOS,
   ITPACK,
   QTYIN,
   QTYOUT,
   DISC_AMT_GROSS,
   LCNO,
   SUPPLIER_INVOICENO,
   SECTION,
   ORD_NO,
   SHIP_CO,
   BANK_NAME,
   DEPTNO,
   C_CUS_NO,
   C_BRANCH_NO,
   INV_AMT,
   SUPP_NAME,
   COSTCENT,
   CS_NAME,
   SHORT_NAME,
   SHORT_NAME_A,
   NAME_A,
   SLSMN_NAME,
   ITPRICE4,
   BARCODE,
   MEMO,
   LOCATION_CODE
)
AS
   SELECT   INITCAP (locations.NAME) location_name,
            invoice2.keyfld,
            items.descr2,
            items.parentitem,
            INITCAP (NVL (it2.descr, IT2.DESCRA)) parentitemdescr,
            ordwas,
            invoice2.additional_amt,
            invoice2.packaged,
            invoice1.ordno,
            invoice1.invoice_no,
            invoice2.dat,
            invoice2.invoice_code,
            invoice1.inv_ref,
            INITCAP (invoice1.inv_refnm) INV_REFNM,
            invoice1.currency,
            invoice_date,
            invoice1.rate,
            invoice2.TYPE,
            invoice2.refer,
            invoice1.slsmn,
            invoice2.price,
            invoice2.allqty,
            invoice2.prd_date,
            invoice2.exp_date,
            items.mfcode,
            invoice2.disc_amt,
            invoice2.stra,
            invoice1.lpno,
            invoice1.duedate lpdate,
            invoice2.strb,
            items.ctg,
            items.qtydenied,
            INITCAP (items.descr) descr,
            INITCAP (items.descra) descra,
            invoice2.orderno,
            invoice2.pkcost,
            invoice2.pack,
            invoice2.packd,
            items.pkaver,
            items.packd itpackd,
            invoice2.itempos,
            items.pack itpack,
            invoice2.qtyin,
            invoice2.qtyout,
            disc_amt_gross,
            invoice1.lcno,
            invoice1.supinvno supplier_invoiceno,
            invoice1.section,
            invoice1.ord_no,
            invoice1.shipco ship_co,
            invoice1.bank bank_name,
            deptno,
            c_cus_no,
            c_branch_no,
            inv_amt,
            c_ycust_supp.name supp_name,
            accostcent1.code costcent,
            accostcent1.title cs_name,
            INVOICE_CODES.SHORT_NAME,
            INVOICE_CODES.SHORT_NAME_A,
            INVOICE_CODES.NAME_A,
            SALESP.NAME SLSMN_NAME,
            ITEMS.ITPRICE4,
            items.barcode,
            invoice1.memo,
            invoice1.LOCATION_CODE
     FROM   invoice1,
            invoice2,
            items,
            locations,
            items it2,
            c_ycust c_ycust_supp,
            accostcent1,
            INVOICE_CODES,
            SALESP
    WHERE       items.REFERENCE = invoice2.refer
            AND locations.code = invoice1.location_code
            AND invoice1.keyfld = invoice2.keyfld
            AND items.parentitem = it2.REFERENCE(+)
            AND c_ycust_supp.code(+) = items.mfcode
            AND accostcent1.code(+) = invoice1.costcent
            AND INVOICE_CODES.CODE(+) = INVOICE1.TYPE
            AND SALESP.NO(+) = INVOICE1.SLSMN;

CREATE OR REPLACE FORCE VIEW C76EUR.C7_STOCKCARD
(
   USERNM,
   REFERENCE,
   DESCR,
   QTYIN,
   QTYOUT,
   QTYINUNIT,
   QTYOUTUNIT,
   QTYCOST,
   KEYFLD,
   INVOICE_CODE,
   TYPE,
   INVOICE_NO,
   INVOICE_DATE,
   AVGCOST,
   POSX,
   STRNO,
   TOTQTY,
   PACKD,
   PACK,
   COSTPRICE,
   TYPE_NAME,
   TYPE_NAMEA,
   TOTCOST,
   INV_REF,
   INV_REFNM,
   INVOICE_KEYFLD,
   PO_KEYFLD,
   PO_POSNO,
   GR_KEYFLD,
   PORD_NO,
   GORD_NO
)
AS
     SELECT   USERNM,
              field1 REFERENCE,
              field2 descr,
              ROUND (TO_NUMBER (field3) / TO_NUMBER (field16), 5) qtyin,
              ROUND (TO_NUMBER (field4) / TO_NUMBER (field16), 5) qtyout,
              TO_NUMBER (field3) qtyinunit,
              TO_NUMBER (field4) qtyoutunit,
              TO_NUMBER (field5) qtycost,
              TO_NUMBER (field6) keyfld,
              TO_NUMBER (field7) invoice_code,
              TO_NUMBER (field8) TYPE,
              TO_NUMBER (field9) invoice_no,
              TO_DATE (field10, 'dd/mm/yyyy') invoice_date,
              TO_NUMBER (field11) avgcost,
              TO_NUMBER (field12) posx,
              TO_NUMBER (field13) strno,
              ROUND (TO_NUMBER (field14) / TO_NUMBER (field16), 5) totqty,
              (field15) packd,
              TO_NUMBER (field16) pack,
              TO_NUMBER (field17) costprice,
              FIELD18 TYPE_NAME,
              field19 type_namea,
              TO_NUMBER (FIELD14) * (TO_NUMBER (FIELD11) / TO_NUMBER (FIELD16))
                 totcost,
              FIELD20 INV_REF,
              FIELD21 INV_REFNM,
              FIELD22 INVOICE_KEYFLD,
              FIELD23 PO_KEYFLD,
              FIELD24 PO_POSNO,
              FIELD25 GR_KEYFLD,
              FIELD26 PORD_NO,
              FIELD27 GORD_NO
       FROM   TEMPORARY
      WHERE   idno = 777
   ORDER BY   USERNM, TO_NUMBER (field12);


CREATE OR REPLACE PROCEDURE C76EUR.C7_REPAIRCOST2BYSTORE(STX NUMBER,RFR IN VARCHAR2,DTX IN DATE,QNTY OUT number,COSTX OUT number) IS
--cursor opn is 
--   select nvl(sum(qty*u_cost),0) / nvl(sum(qty) ,1), nvl(sum(qty*u_cost),0),nvl(sum(qty),0) from INVENTORY where refer=rfr AND dat<=DTX;
CURSOR INVS IS 
SELECT 
           SUM(invoice2.allqty) ALLQTY, refer,
          invoice2.invoice_code, DAT,STRA,
                  invoice2.price,
          invoice2.pkcost, invoice2.pack
     FROM  PUR2 invoice2, items,INVOICE_CODES
    WHERE items.REFERENCE = invoice2.refer
      AND DESCR2 LIKE RFR||'%'
      AND (STRA=STX OR STRB=STX) 
      AND DAT<=DTX AND INVOICE_CODE=CODE
            GROUP BY  invoice2.invoice_code, DAT,
                              invoice2.price,refer,
                      invoice2.pkcost, invoice2.pack,NAME_A,STRA
            order by DAT,INVOICE_CODES.NAME_A;
            
-- inx.dat=dat and refer=inx.refer and invoice_code=inx.invoice_code and 
-- price=inx.price and pkcost=inx.pkcost and inx.pack=pack;
 
QNT NUMBER:=0;
TOTBF NUMBER:=0;
A NUMBER;
CST number:=0;
wg number :=0;
TOTCST number:=0;
DT DATE;
BEGIN
--open opn;
--fetch opn into cst,totcst,qnt;

for inx in invs
loop
-- ****************if OPEN
if inx.invoice_code=1 then
 if qnt>0 then
  cst:=(totcst + (inx.pkcost*inx.allqty))/ (qnt+inx.allqty) ;
 else
  cst:=inx.pkcost;
 end if;
 totcst:=(totcst + (inx.pkcost*inx.allqty));
 qnt:=qnt+inx.allqty;
end if;
-- ****************if purchase recipts
if inx.invoice_code =11 then
 if qnt>0 then
  cst:=(totcst + (inx.pkcost*inx.allqty))/ (qnt+inx.allqty) ;
 else
  cst:=inx.pkcost;
 end if;
 totcst:=(totcst + (inx.pkcost*inx.allqty));
 qnt:=qnt+inx.allqty;
end if;
-- ****************if purchase return
if inx.invoice_code=22 then
 qnt:=qnt-inx.allqty;
 totcst:=(totcst - ((inx.price/inx.pack)*inx.allqty));
 if qnt>0 then
  cst:=totcst/qnt;
 else
  cst:=cst;
 end if;
end if;
-- ****************if sale
if inx.invoice_code=21 then  
 qnt:=qnt-inx.allqty;
 totcst:=(totcst - (cst*inx.allqty));
 if qnt>0 then
  cst:=totcst/qnt;
 else
  cst:=cst;
 end if;
end if;

-- ****************if issue
if inx.invoice_code=25 then  
 qnt:=qnt-inx.allqty;
 totcst:=(totcst - (cst*inx.allqty));
 if qnt>0 then
  cst:=totcst/qnt;
 else
  cst:=cst;
 end if;
end if;

-- ****************if sale return
if inx.invoice_code=12 then
 if qnt>0 then
  cst:=(totcst + (inx.pkcost*inx.allqty))/ (qnt+inx.allqty) ;
 else
  cst:=inx.pkcost;
 end if;
 totcst:=(totcst + (inx.pkcost*inx.allqty));
 qnt:=qnt+inx.allqty;
end if;

-- ****************if transfer



if inx.invoice_code=3  then

  if STX=inx.stra then
      --qnt:=qnt-inx.allqty;
        qnt:=qnt-inx.allqty;
         totcst:=(totcst - (cst*inx.allqty));
         --if qnt>0 then
      --    cst:=totcst/qnt;
         --else
      --    cst:=cst;
         --end if;
 else
      --qnt:=qnt+inx.allqty;
 --if qnt>0 then
 -- cst:=(totcst + (inx.pkcost*inx.allqty))/ (qnt+inx.allqty) ;
 --else
  --cst:=inx.pkcost;
 --end if;
    totcst:=(totcst + (inx.pkcost*inx.allqty));
    qnt:=qnt+inx.allqty;
  end if;
END IF;

if inx.invoice_code=3  then
    NULL;
end if;

-- ****************if assembly voucher delivered. 
if inx.invoice_code=27 then
 qnt:=qnt-inx.allqty;
 totcst:=(totcst - ((cst)*inx.allqty));
end if;

-- ****************if assembly voucher finished 
if inx.invoice_code=17 then
 if qnt>0 then
  cst:=(totcst + ((cst)*inx.allqty))/ (qnt+inx.allqty);
 else
  cst:=cst;
 end if;
 totcst:=(totcst + ((cst)*inx.allqty));
 qnt:=qnt+inx.allqty; 
end if;

-- ****************IF ADJUST MENT IN
if inx.invoice_code=19 then
 if qnt>0 then
  cst:=(totcst + ((cst)*inx.allqty))/ (qnt+inx.allqty);
 else
  cst:=cst;
 end if;
 totcst:=(totcst + ((cst)*inx.allqty));
 qnt:=qnt+inx.allqty;  
end if;

-- ****************IF ADJUST MENT OUT
if inx.invoice_code=29 then
 qnt:=qnt-inx.allqty;
 totcst:=(totcst - ((cst)*inx.allqty)); 
 if qnt>0 then
  cst:=totcst/qnt;
 else
  cst:=cst;
 end if; 
end if;

end loop;
COSTX:=CST;
QNTY:=QNT;

END;
/

CREATE OR REPLACE PROCEDURE C76EUR.c7_EXE_STKC(PSTRNO NUMBER,PREFER VARCHAR2,PFROMDATE DATE,PTODATE DATE,PUSER VARCHAR2)
IS
   RFRX                VARCHAR2 (100);
   FROMDATE            DATE;
   TODATE              DATE;
   STORENO             NUMBER;
   USERNAME            VARCHAR2 (255) := 'A';
   itmpath             VARCHAR2 (1000);
   advance_stockcard   BOOLEAN := FALSE;
   global_cost         NUMBER;

   TYPE tag_STOCKCARDTB
   IS
      RECORD (
         REFERENCE        VARCHAR2 (100),
         DESCR            VARCHAR2 (500),
         QTYIN            NUMBER,
         QTYOUT           NUMBER,
         QTYCOST          NUMBER,
         COSTPRICE        NUMBER,
         KEYFLD           NUMBER,
         INVOICE_CODE     NUMBER,
         INVOICE_TYPE     NUMBER,
         INVOICE_NO       NUMBER,
         INVOICE_DATE     DATE,
         AVGCOST          NUMBER,
         POSX             NUMBER,
         STORE            NUMBER,
         TOTQTY           NUMBER,
         PACKD            VARCHAR2 (50),
         PACK             NUMBER,
         TYPE_NAMEA       VARCHAR2 (100),
         TYPE_NAMEE       VARCHAR2 (100),
         INV_REF          VARCHAR2 (500),
         INV_REFNM        VARCHAR2 (500),
         INVOICE_KEYFLD   NUMBER,
         PO_KEYFLD       NUMBER,
         PO_POSNO        NUMBER,
         GR_KEYFLD       NUMBER,
         GR_POS          NUMBER,     
         PORD_NO         NUMBER,
         GORD_NO         NUMBER
      );
   XTQTY               NUMBER := 0;
   XTCOST              NUMBER := 0;

   TYPE STOCKCARDTBARRAY
   IS
      TABLE OF TAG_STOCKCARDTB
         INDEX BY BINARY_INTEGER;

   STKCRD1             STOCKCARDTBARRAY;
   STKCRD1CNT          INTEGER := 0;

   CURSOR TRNX1
   IS
      SELECT   invoice2.keyfld,
            items.descr2,
            items.parentitem,
            ordwas,
            invoice_no,
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
            items.pkaver,
            items.packd itpackd,
            invoice2.itempos,
            items.pack itpack,
            '' INV_REF,
            '' INV_REFNM,
            invoice2.qtyin,
            invoice2.qtyout,
            disc_amt_gross,
            (SHORT_NAME) CODE_NAMEE,
            SHORT_NAME_A CODE_NAMEA,
            INVOICE2.PO_KEYFLD,
            INVOICE2.PO_POSNO,
            INVOICE2.GR_KEYFLD,
            INVOICE2.GR_POS,
            INVOICE2.INVOICE_CODE INV_INVOICE_CODE,
            POD.ORD_NO POSO,
            PGOD.ORD_NO GORD_NO
     FROM   invoice2,
            items,
            INVOICE_CODES,
            (SELECT ORD_NO,KEYFLD PORD_KEYFLD FROM PORD1 ) POD,
            (SELECT ORD_NO,KEYFLD GORD_KEYFLD FROM ORDER1 WHERE ORD_CODE IN (9,110)) PGOD 
            
    WHERE       items.REFERENCE = invoice2.refer
            AND dat >= fromdate
            AND dat <= todate
            AND items.descr2 LIKE itmpath||'%'
            AND CODE = invoice2.TYPE
            AND POD.PORD_KEYFLD(+)=INVOICE2.PO_KEYFLD
            AND PGOD.GORD_KEYFLD(+)=INVOICE2.GR_KEYFLD
      ORDER BY  INVOICE2.DAT,
                 name_a,
                 keyfld,
                 itempos;
                                  
   CURSOR TRNX12
   IS
   SELECT   invoice2.keyfld,
            items.descr2,
            items.parentitem,
            ordwas,
            invoice_no,
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
            items.pkaver,
            items.packd itpackd,
            invoice2.itempos,
            items.pack itpack,
            '' INV_REF,
            '' INV_REFNM,
            invoice2.qtyin,
            invoice2.qtyout,
            disc_amt_gross,
            (SHORT_NAME) CODE_NAMEE,
            SHORT_NAME_A CODE_NAMEA,
            INVOICE2.PO_KEYFLD,
            INVOICE2.PO_POSNO,
            INVOICE2.GR_KEYFLD,
            INVOICE2.GR_POS,
            INVOICE2.INVOICE_CODE INV_INVOICE_CODE,
            POD.ORD_NO POSO,
            PGOD.ORD_NO GORD_NO
     FROM   invoice2,
            items,
            invoice_codes,
            (SELECT ORD_NO,KEYFLD PORD_KEYFLD FROM PORD1 ) POD,
            (SELECT ORD_NO,KEYFLD GORD_KEYFLD FROM ORDER1 WHERE ORD_CODE IN (9,110)) PGOD
    WHERE       items.REFERENCE = invoice2.refer
            AND dat >= fromdate
            AND dat <= todate
            AND items.descr2 LIKE itmpath||'%'
            AND (STRA = storeno OR STRB = storeno )
            AND CODE = invoice2.TYPE
            AND POD.PORD_KEYFLD(+)=INVOICE2.PO_KEYFLD
            AND PGOD.GORD_KEYFLD(+)=INVOICE2.GR_KEYFLD
            order by
                 name_a,
                 keyfld,
                 itempos;

   INX                 trnx1%ROWTYPE;

   FUNCTION getitempath (rfr VARCHAR2)
      RETURN VARCHAR2
   IS
      pt   VARCHAR2 (100);
   BEGIN
      SELECT   MAX (descr2)
        INTO   pt
        FROM   items
       WHERE   reference = rfr;

      RETURN pt;
   END;

   FUNCTION calculatecost (QNTY          OUT NUMBER,
                           COSTX         OUT NUMBER,
                           QNTYY      IN     NUMBER,
                           COSTXX     IN     NUMBER,
                           storenox          NUMBER:= 0)
      RETURN NUMBER
   IS
      QNT      NUMBER := QNTYY;
      CST      NUMBER := 0;
      TOTCST   NUMBER := COSTXX;
   BEGIN
      IF qnt > 0
      THEN
         cst := totcst / qnt;
      END IF;

      IF inx.invoice_code = 1
      THEN
         IF qnt + inx.allqty > 0
         THEN
            cst := (totcst + (inx.pkcost * inx.allqty)) / (qnt + inx.allqty);
         ELSE
            cst := inx.pkcost;
         END IF;

         totcst := (totcst + (inx.pkcost * inx.allqty));
         qnt := qnt + inx.allqty;
      END IF;

      -- ****************if purchase recipts
      IF inx.invoice_code IN (13, 11)
      THEN
         IF qnt + inx.allqty > 0
         THEN
            cst := (totcst + (inx.pkcost * inx.allqty)) / (qnt + inx.allqty);
         ELSE
            cst := inx.pkcost;
         END IF;

         totcst := (totcst + (inx.pkcost * inx.allqty));
         qnt := qnt + inx.allqty;
      END IF;

      -- ****************if purchase return
      IF inx.invoice_code = 22
      THEN
         qnt := qnt - inx.allqty;
         totcst := (totcst - ( (inx.price / inx.pack) * inx.allqty));

         IF qnt > 0
         THEN
            cst := totcst / qnt;
         ELSE
            cst := cst;
         END IF;
      END IF;

      -- ****************if sale
      IF inx.invoice_code = 21
      THEN
         qnt := qnt - inx.allqty;
         totcst := (totcst - (cst * inx.allqty));

         IF qnt > 0
         THEN
            cst := totcst / qnt;
         ELSE
            cst := cst;
         END IF;
      END IF;

      -- ****************if issue
      IF inx.invoice_code = 25
      THEN
         qnt := qnt - inx.allqty;
         totcst := (totcst - (cst * inx.allqty));

         IF qnt > 0
         THEN
            cst := totcst / qnt;
         ELSE
            cst := cst;
         END IF;
      END IF;

      -- ****************if issue
      IF inx.invoice_code IN (26, 28)
      THEN
         qnt := qnt - inx.allqty;
         totcst := (totcst - (cst * inx.allqty));

         IF qnt > 0
         THEN
            cst := totcst / qnt;
         ELSE
            cst := cst;
         END IF;
      END IF;


      -- ****************if sale return
      IF inx.invoice_code = 12
      THEN
         IF qnt > 0
         THEN
            cst := (totcst + (inx.pkcost * inx.allqty)) / (qnt + inx.allqty);
         ELSE
            cst := inx.pkcost;
         END IF;

         totcst := (totcst + (inx.pkcost * inx.allqty));
         qnt := qnt + inx.allqty;
      END IF;

      -- ****************if transfer

      IF inx.invoice_code = 3 AND storenox != 0
      THEN
         IF INX.INV_INVOICE_CODE = 25
         THEN
            qnt := qnt - inx.allqty;
            totcst := (totcst - (cst * inx.allqty));
         ELSE
            totcst := (totcst + (inx.pkcost * inx.allqty));
            qnt := qnt + inx.allqty;
         END IF;

         IF qnt > 0
         THEN
            cst := totcst / qnt;
         ELSE
            cst := cst;
         END IF;
      END IF;

      -- ****************if assembly voucher delivered.
      IF inx.invoice_code = 27
      THEN
         qnt := qnt - inx.allqty;
         totcst := (totcst - ( (inx.pkcost) * inx.allqty));
      END IF;

      -- ****************if assembly voucher finished
      IF inx.invoice_code = 17
      THEN
         IF qnt > 0
         THEN
            cst :=
               (totcst + ( (inx.pkcost) * inx.allqty)) / (qnt + inx.allqty);
         ELSE
            cst := cst;
         END IF;

         totcst := (totcst + ( (cst) * inx.allqty));
         qnt := qnt + inx.allqty;
      END IF;

      -- ****************IF ADJUST MENT IN
      IF inx.invoice_code = 19
      THEN
         IF qnt > 0
         THEN
            cst := (totcst + ( (cst) * inx.allqty)) / (qnt + inx.allqty);
         ELSE
            cst := cst;
         END IF;

         totcst := (totcst + ( (cst) * inx.allqty));
         qnt := qnt + inx.allqty;
      END IF;

      -- ****************IF ADJUST MENT OUT
      IF inx.invoice_code = 29
      THEN
         qnt := qnt - inx.allqty;
         totcst := (totcst - ( (cst) * inx.allqty));

         IF qnt > 0
         THEN
            cst := totcst / qnt;
         ELSE
            cst := cst;
         END IF;
      END IF;

      IF inx.invoice_code = 30
      THEN
         qnt := qnt - inx.allqty;
         totcst := (totcst - ( (cst) * inx.allqty));

         IF qnt > 0
         THEN
            cst := totcst / qnt;
         ELSE
            cst := cst;
         END IF;
      END IF;
      COSTX := CST;
      QNTY := QNT;
      RETURN 0;
   END;

   PROCEDURE INSERT_TMP_BF (QNTYOUT    NUMBER,
                            QNTYIN     NUMBER,
                            TOTQTY     NUMBER,
                            TOTCST     NUMBER,
                            AVGCOST    NUMBER,
                            RFR        VARCHAR2,
                            DT         DATE)
   IS
      ITMDESCR   VARCHAR2 (500);
      PKD        VARCHAR2 (50);
      PK         NUMBER;
   BEGIN
      SELECT   NVL (DESCR, DESCRA), PACKD, PACK
        INTO   ITMDESCR, PKD, PK
        FROM   ITEMS
       WHERE   REFERENCE = RFR;

      STKCRD1CNT := NVL (STKCRD1CNT, 0) + 1;
      STKCRD1 (STKCRD1CNT).REFERENCE := RFR;
      STKCRD1 (STKCRD1CNT).DESCR := ITMDESCR;
      STKCRD1 (STKCRD1CNT).QTYIN := QNTYIN;
      STKCRD1 (STKCRD1CNT).QTYOUT := QNTYOUT;
      STKCRD1 (STKCRD1CNT).QTYCOST := TOTCST;
      STKCRD1 (STKCRD1CNT).KEYFLD := -1;
      STKCRD1 (STKCRD1CNT).INVOICE_CODE := 0;
      STKCRD1 (STKCRD1CNT).INVOICE_TYPE := 0;
      STKCRD1 (STKCRD1CNT).INVOICE_NO := 0;
      STKCRD1 (STKCRD1CNT).INVOICE_DATE := DT;
      STKCRD1 (STKCRD1CNT).AVGCOST := AVGCOST * pk;
      STKCRD1 (STKCRD1CNT).COSTPRICE := AVGCOST * pk;
      STKCRD1 (STKCRD1CNT).POSX := 1;
      STKCRD1 (STKCRD1CNT).STORE := 0;
      STKCRD1 (STKCRD1CNT).TOTQTY := TOTQTY;
      STKCRD1 (STKCRD1CNT).PACKD := PKD;
      STKCRD1 (STKCRD1CNT).PACK := PK;
      STKCRD1 (STKCRD1CNT).type_namee := 'B/F';

   END;

   PROCEDURE INSERT_TMP (QNTYOUT    NUMBER,
                         QNTYIN     NUMBER,
                         TOTQTY     NUMBER,
                         TOTCST     NUMBER,
                         AVGCOST    NUMBER,
                         str        NUMBER,
                         typstre    VARCHAR2,
                         typstra    VARCHAR2,
                         invr       VARCHAR2,
                         invr_n     VARCHAR2)
   IS
      ITMDESCR   VARCHAR2 (500);
      PKD        VARCHAR2 (50);
      PK         NUMBER;
      INO        NUMBER;
   BEGIN
      --SELECT NVL(DESCR,DESCRA),PACKD,PACK INTO ITMDESCR,PKD,PK FROM ITEMS WHERE REFERENCE=INX.REFER;
      SELECT   MAX (INVOICE_NO)
        INTO   INO
        FROM   PUR1
       WHERE   KEYFLD = INX.INVOICE_KEYFLD;

      STKCRD1CNT := NVL (STKCRD1CNT, 0) + 1;
      STKCRD1 (STKCRD1CNT).REFERENCE := INX.REFER;
      STKCRD1 (STKCRD1CNT).DESCR := INX.DESCR;
      STKCRD1 (STKCRD1CNT).QTYIN := QNTYIN;
      STKCRD1 (STKCRD1CNT).QTYOUT := QNTYOUT;
      STKCRD1 (STKCRD1CNT).QTYCOST := TOTCST;
      STKCRD1 (STKCRD1CNT).COSTPRICE := INX.PKCOST * inx.itpack;
      STKCRD1 (STKCRD1CNT).KEYFLD := INX.KEYFLD;
      STKCRD1 (STKCRD1CNT).INVOICE_CODE := INX.INVOICE_CODE;
      STKCRD1 (STKCRD1CNT).INVOICE_TYPE := INX.TYPE;
      STKCRD1 (STKCRD1CNT).INVOICE_NO := NVL (INO, INX.INVOICE_NO);
      STKCRD1 (STKCRD1CNT).INVOICE_DATE := INX.invoice_date;
      STKCRD1 (STKCRD1CNT).AVGCOST := AVGCOST * inx.itpack;
      STKCRD1 (STKCRD1CNT).POSX := STKCRD1CNT;
      STKCRD1 (STKCRD1CNT).STORE := STR;
      STKCRD1 (STKCRD1CNT).TOTQTY := TOTQTY;
      STKCRD1 (STKCRD1CNT).PACKD := INX.ITPACKD;
      STKCRD1 (STKCRD1CNT).PACK := INX.ITPACK;
      STKCRD1 (STKCRD1CNT).type_namee := typstre;
      STKCRD1 (STKCRD1CNT).type_namea := typstra;
      STKCRD1 (STKCRD1CNT).inv_ref := invr;
      STKCRD1 (STKCRD1CNT).inv_refnm := invr_n;
      STKCRD1 (STKCRD1CNT).INVOICE_KEYFLD := INX.INVOICE_KEYFLD;
      STKCRD1 (STKCRD1CNT).PO_KEYFLD := INX.PO_KEYFLD;
      STKCRD1 (STKCRD1CNT).PO_POSNO := INX.PO_POSNO;
      STKCRD1 (STKCRD1CNT).GR_KEYFLD := INX.GR_KEYFLD;
      STKCRD1 (STKCRD1CNT).PORD_NO := INX.POSO;
      STKCRD1 (STKCRD1CNT).GORD_NO := INX.GORD_NO;
   END;

   PROCEDURE BUILD_STR (XTQTY OUT NUMBER, XTCOST OUT NUMBER)
   IS
      A         NUMBER;
      QTYOB     NUMBER := 0;
      COSTOB    NUMBER := 0;
      tmpcost   NUMBER := 0;
      tmpqty    NUMBER := 0;
      cqty      NUMBER := 0;
      ccost     NUMBER := 0;
      totcost   NUMBER := 0;
      totqty    NUMBER := 0;
      inq       NUMBER := 0;
      ouq       NUMBER := 0;
      dm        NUMBER := 0;
      strx      NUMBER;
      g_cost    NUMBER;
      g_qty     NUMBER;
   BEGIN
      STKCRD1CNT := 0;
      storeno := NVL (storeno, 0);
      itmpath := getitempath (rfrx);


      C7_repaircost2BYSTORE (STORENO,
                             ITMPATH,
                             fromdate - 1,
                             qtyob,
                             costob);

      IF QTYOB != 0
      THEN
         insert_tmp_bf (0,
                        qtyob,
                        qtyob,
                        costob * qtyob,
                        costob,
                        rfrx,
                        fromdate);
      END IF;

      totcost := qtyob * costob;
      totqty := qtyob;
      ccost := costob;
      cqty := qtyob;

      DELETE FROM   parameter
            WHERE   usernm = USERENV ('terminal');

      INSERT INTO parameter (usernm,
                             tono,
                             fromtxt,
                             fromdt,
                             todt)
        VALUES   (USERENV ('terminal'),
                  storeno,
                  itmpath || '%',
                  fromdate,
                  todate);

      FOR x IN trnx12
      LOOP
         inx := x;
         OUQ := 0;
         INQ := 0;
         strx := inx.stra;

         IF storeno != 0
         THEN
            tmpcost := totcost;
            tmpqty := totqty;
            dm :=
               calculatecost (tmpqty,
                              tmpcost,
                              TOTQTY,
                              TOTCOST,
                              storeno);
            totcost := tmpcost * tmpqty;
            totqty := tmpqty;
            cqty := inx.allqty;
            ccost := tmpcost;

            IF inx.invoice_code > 20
            THEN
               ouq := inx.allqty;
            END IF;

            IF inx.invoice_code <= 20 AND inx.invoice_code != 3
            THEN
               inq := inx.allqty;
            END IF;

            IF inx.invoice_code = 3 AND inx.INV_INVOICE_CODE = 25
            THEN
               ouq := inx.allqty;
               strx := inx.stra;
            END IF;

            IF inx.invoice_code = 3 AND inx.INV_INVOICE_CODE = 13
            THEN
               inq := inx.allqty;
               strx := inx.stra;
            END IF;

            insert_tmp (ouq,
                        inq,
                        totqty,
                        totcost,
                        ccost,
                        strx,
                        inx.code_namee,
                        inx.code_namea,
                        inx.inv_ref,
                        inx.inv_refnm);
         END IF;                                        -- storeno is not zero
      END LOOP;

      XTQTY := TOTQTY;
      XTCOST := TOTCOST;

      SELECT   NVL (SUM ( (QTYIN - QTYOUT) * PKCOST), 0),
               NVL (SUM (QTYIN - QTYOUT), 0)
        INTO   g_cost, g_qty
        FROM   INVOICE2, items
       WHERE       INVOICE_CODE != 3
               AND reference = refer
               AND descr2 LIKE itmpath || '%'
               AND DAT <= todAtE;

      IF g_qty > 0
      THEN
         global_cost := g_cosT / G_QTY;
      --g_qty:=msgbox(g_cost/g_qty);
      END IF;

   END;
   PROCEDURE BUILD (XTQTY OUT NUMBER, XTCOST OUT NUMBER)
   IS
      A         NUMBER;
      QTYOB     NUMBER := 0;
      COSTOB    NUMBER := 0;
      tmpcost   NUMBER := 0;
      tmpqty    NUMBER := 0;
      cqty      NUMBER := 0;
      ccost     NUMBER := 0;
      totcost   NUMBER := 0;
      totqty    NUMBER := 0;
      inq       NUMBER := 0;
      ouq       NUMBER := 0;
      dm        NUMBER := 0;
      strx      NUMBER;
      g_cost    NUMBER;
      g_qty     NUMBER;
   BEGIN
      IF STORENO != 0
      THEN
         BUILD_STR (XTQTY, XTCOST);
      ELSE
         STKCRD1CNT := 0;
         storeno := NVL (storeno, 0);
         itmpath := getitempath (rfrx);

         repair.repaircost2 (rfrx,
                             fromdate - 1,
                             qtyob,
                             costob);
         --dbms_output.put_line(itmpath||' , '||qtyob||' '||(fromdate-1));

         IF QTYOB != 0
         THEN
            insert_tmp_bf (0,
                           qtyob,
                           qtyob,
                           costob * qtyob,
                           costob,
                           rfrx,
                           fromdate);
         END IF;

         totcost := qtyob * costob;
         totqty := qtyob;
         ccost := costob;
         cqty := qtyob;

         DELETE FROM   parameter
               WHERE   usernm = USERNAME;

         INSERT INTO parameter (usernm,
                                tono,
                                fromtxt,
                                FROMDT,
                                TODT)
           VALUES   (USERNAME,
                     storeno,
                     itmpath || '%',
                     fromdate,
                     todate);

         FOR x IN trnx1
         LOOP
            inx := x;
            OUQ := 0;
            INQ := 0;
            strx := inx.stra;

            IF storeno != 0 OR inx.invoice_code != 3
            THEN
               tmpcost := totcost;
               tmpqty := totqty;
               dm :=
                  calculatecost (tmpqty,
                                 tmpcost,
                                 TOTQTY,
                                 TOTCOST);
               totcost := tmpcost * tmpqty;
               totqty := tmpqty;
               cqty := inx.allqty;
               ccost := tmpcost;

               IF inx.invoice_code > 20
               THEN
                  ouq := inx.allqty;
               END IF;

               IF inx.invoice_code <= 20 AND inx.invoice_code != 3
               THEN
                  inq := inx.allqty;
               END IF;

               IF inx.invoice_code = 3 AND inx.inv_invoice_code = 13
               THEN
                  inq := inx.allqty;
               END IF;

               IF inx.invoice_code = 3 AND inx.inv_invoice_code = 25
               THEN
                  ouq := inx.allqty;
               END IF;

               insert_tmp (ouq,
                           inq,
                           totqty,
                           totcost,
                           ccost,
                           strx,
                           inx.code_namee,
                           inx.code_namea,
                           inx.inv_ref,
                           inx.inv_refnm);
            END IF;                                     -- storeno is not zero
         END LOOP;

         XTQTY := TOTQTY;
         XTCOST := TOTCOST;

         SELECT   NVL (SUM ( (QTYIN - QTYOUT) * PKCOST), 0),
                  NVL (SUM (QTYIN - QTYOUT), 0)
           INTO   g_cost, g_qty
           FROM   INVOICE2, items
          WHERE       INVOICE_CODE != 3
                  AND reference = refer
                  AND descr2 LIKE itmpath || '%'
                  AND DAT <= todate;

         IF g_qty > 0
         THEN
            global_cost := g_cosT / G_QTY;
         END IF;

      END IF;                                                -- IF STORENO !=0
   END;

   PROCEDURE INSERT_DATA
   IS
      CNTS   INTEGER := 0;
   BEGIN
      DELETE FROM   TEMPORARY
            WHERE   (IDNO = 777 OR IDNO = 776)
                    AND USERNM = USERNAME;

      --  INSERT INTO TEMPORARY(IDNO,USERNM,FIELD1,FIELD2,FIELD3,FIELD4,FIELD5,FIELD6) VALUES
      --     (776,USERENV('TERMINAL'),RFRX,:HEAD.DESCRX,:STORE,TO_CHAR(:FROMDT,'DD/MM/RRRR'),TO_CHAR(:TODT,'DD/MM/RRRR'),STKCRD1(STKCRD1CNT).QTYCOST );
      FOR XX IN 1 .. STKCRD1CNT
      LOOP
         INSERT INTO TEMPORARY (IDNO,
                                USERNM,
                                FIELD1,
                                FIELD2,
                                FIELD3,
                                FIELD4,
                                FIELD5,
                                FIELD6,
                                FIELD7,
                                FIELD8,
                                FIELD9,
                                FIELD10,
                                FIELD11,
                                FIELD12,
                                field13,
                                field14,
                                FIELD15,
                                FIELD16,
                                FIELD17,
                                field18,
                                field19,
                                field20,
                                field21,
                                FIELD22,
                                FIELD23,
                                FIELD24,
                                FIELD25,
                                FIELD26,
                                FIELD27                                
                                 )
           VALUES   (777,
                     USERNAME,
                     STKCRD1 (XX).REFERENCE,
                     STKCRD1 (XX).DESCR,
                     STKCRD1 (XX).QTYIN,
                     STKCRD1 (XX).QTYOUT,
                     STKCRD1 (XX).QTYCOST,
                     STKCRD1 (XX).KEYFLD,
                     STKCRD1 (XX).INVOICE_CODE,
                     STKCRD1 (XX).INVOICE_TYPE,
                     STKCRD1 (XX).INVOICE_NO,
                     TO_CHAR (STKCRD1 (XX).INVOICE_DATE, 'DD/MM/YYYY'),
                     STKCRD1 (XX).AVGCOST,
                     STKCRD1 (XX).POSX,
                     STKCRD1 (XX).stOrE,
                     STKCRD1 (XX).totqty,
                     STKCRD1 (XX).PACKD,
                     STKCRD1 (XX).PACK,
                     STKCRD1 (XX).COSTPRICE,
                     STKCRD1 (XX).TYPE_NAMEe,
                     STKCRD1 (XX).TYPE_NAMEa,
                     STKCRD1 (XX).inv_ref,
                     STKCRD1 (XX).inv_refnm,
                     STKCRD1 (XX).INVOICE_KEYFLD,
                     STKCRD1 (XX).PO_KEYFLD,
                     STKCRD1 (XX).PO_POSNO,
                     STKCRD1 (XX).GR_KEYFLD,
                     STKCRD1 (XX).PORD_NO,
                     STKCRD1 (XX).GORD_NO
                     );
      END LOOP;
   END;
BEGIN
   FROMDATE:=PFROMDATE;
   TODATE:=PTODATE;
   STORENO:=PSTRNO;
   RFRX:=PREFER;
   USERNAME:=PUSER;
   BUILD (XTQTY, XTCOST);
   INSERT_DATA;
END;
/

            

CREATE OR REPLACE FUNCTION C76EUR.C7_GET_STORE_ITEM_ALLQTY(RFR VARCHAR2,DT DATE:=TO_DATE('31/12/2099','DD/MM/RRRR'),pstrno number:=0,includeReserve varchar2:='N' ,PPRDT DATE:=NULL,PEXPDT DATE:=NULL,excludePordKf varchar2:='',excludeOrdsKf varchar2:='',excludeInvsKf varchar2:='') RETURN NUMBER IS
TMP NUMBER;
PRDT DATE:=null;
EXPDT DATE:=null;
BEGIN
 IF (PPRDT IS NOT NULL and pexpdt is not null) THEN
   PRDT:=PPRDT;
   EXPDT:=PEXPDT;
 --ELSE
   --SELECT PRD_DT,EXP_DT  INTO PRDT,EXPDT FROM ITEMS WHERE REFERENCE=RFR;
 END IF; 
 SELECT NVL(SUM(QTYIN-QTYOUT),0) INTO tmp FROM 
     INVOICE2,items WHERE reference=refer
     AND (invoice2.PRD_DATE=PRDT or prdt is null)  AND (INVOICE2.EXP_DATE=EXPDT or expdt is null)  
     and (stra=pstrno or pstrno=0)
     and descr2 like (select nvl(max(descr2),'')||'%' from items where reference=rfr ) AND DAT<=DT and
     (excludePordKf is null or excludePordKf not like '%"'||invoice2.po_keyfld||'"%' ) and
     (excludeOrdsKf is null or excludeOrdsKf not like '%"'||invoice2.orderno||'"%' ) and
     (excludeInvsKf IS NULL OR excludeInvsKf not like '%"'||invoice2.keyfld||'"%' )    
     ;
     if includeReserve='Y' then
        SELECT tmp-nvl(SUM(ORD_ALLQTY-DELIVEREDQTY),0) into tmp FROM joined_pord o1 
            WHERE ORD_REFER=RFR AND ORD_FLAG=2 AND ORDACC IN ('approve','none') and reserved_stock='Y' and 
            (excludePordKf is null or excludePordKf not like '%"'||keyfld||'"%');
     end if;     
 RETURN TMP;
END;
/

