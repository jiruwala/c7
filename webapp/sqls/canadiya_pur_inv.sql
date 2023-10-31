declare 
pcode varchar2(255):=repair.GETSETUPVALUE_2('CURRENT_PERIOD');
ploc varchar2(255):=:txtLoc;
pinvno number:=:txtInv;
pdate date:=:txtDate;
ptype number:=:txtType;
pstr number:=:txtStr;
pref varchar2(255):= :txtRef;

prd_date date;
exp_date date;
kfld number;
posx number:=0;
pr number;
refnm varchar2(500);
totamt number:=0;

cursor ds is select *from c7_rmpord where keyfld in (:txtKflds) order by keyfld;

begin
select nvl(max(keyfld),0)+1 into kfld from pur1;
for x in ds loop
    select nvl(max(price),0) into pr from c7_vrmcont where ref_code=x.ref_code and location_code=x.location_code;
    select prd_dt,exp_dt into prd_date, exp_date from items where reference=x.refer;    

    
    posx:=posx+1;
    insert into pur2(PERIODCODE, LOCATION_CODE, INVOICE_NO,
                INVOICE_CODE, TYPE, ITEMPOS, REFER, STRA, PRICE, PKCOST,
                DISC_AMT, PACK, PACKD, UNITD, DAT, QTY, PKQTY, FREEQTY, FREEPKQTY,
                ALLQTY, PRD_DATE, EXP_DATE, YEAR, FLAG, ORDWAS, KEYFLD, RATE, CURRENCY,
                CREATDT, ORDERNO, QTYIN, QTYOUT, DISC_AMT_GROSS, SLSMNXX,
                RECIEVED_KEYFLD, FREE_ALLQTY,costcent)
                values (
                pcode, ploc, pinvno,
                11, ptype, posx, x.refer, pstr , pr,  pr*1 ,
                0, x.pack, x.packd, x.unitd, pdate,
                0, x.packqty, 0, 0,
                x.packqty*x.pack, prd_date, exp_date, '2003', 2, posx,
                kfld , 1, 'KWD', SYSDATE, X.KEYFLD, X.PACKQTY *X.PACK, 0, 0, null,
                null, 0,'') ;
    totamt:=totamt+(x.packqty*pr);                
    update c7_rmpord set sale_price=pr,PUR_KEYFLD=kfld,flag=2 where keyfld=x.keyfld;

end loop;
select name into refnm from c_ycust where code=pref and childcount=0 and flag=1 ;
if posx>0 then
 insert into PUR1(PERIODCODE, LOCATION_CODE, INVOICE_NO,
                INVOICE_CODE, TYPE, INVOICE_DATE, STRA, SLSMN,
                 MEMO, INV_REF, INV_REFNM, INV_AMT, DISC_AMT, INV_COST,
                 FLAG, CREATDT, LPNO, BKNO, KEYFLD, USERNAME, SUPINVNO, SHIPCO,
                INS_CO, BANK, LCNO, INS_NO, RATE, CURRENCY, KDCOST, CHG_KDAMT,
                ORDERNO, C_CUS_NO,YEAR,NO_OF_RECIEVED,costcent) VALUES
                (pcode, ploc, pinvno,
                 11, ptype, pdate, pstr, null,
                 '', (select ac_no from c_ycust where code=pref ), refnm,
                  totamt, 0, 0,
                 2, sysdate, '', '', kfld,user, '', '',
                '', '', '', '',1, 'KWD',1 , 0,
                null, pref,'2003',0,null);
x_post_purchase(kfld);

end if;

end; 