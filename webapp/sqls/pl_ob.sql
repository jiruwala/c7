delete from acvoucher2 
  where keyfld=-1 and 
           (
             accno like '3%' 
             or accno like '4%' 
             or accno like '5%' 
             or accno like '6%'
           );

alter trigger pass_vou2 disable;

declare
amt number;
ps number;
acnm varchar2(255);
flg number;
acc varchar2(100):='&pl_ac';
DT DATE ;
begin
select sum(debit-credit),nvl(max(pos),0)+1 
		into amt,ps 
		  from acvoucher2 where keyfld=-1;
select name into acnm from acaccount where accno=acc and childcount=0;
select nvl(max(flag),-1),max(vou_date) into flg,dt from acvoucher1 where keyfld=-1;
if flg=-1 then
 raise value_error;
end if;
IF amt<0 THEN
INSERT INTO ACVOUCHER2 (
   PERIODCODE, KEYFLD, NO, 
   VOU_CODE, VOU_DATE, POS, 
   ACCNO, DEBIT, CREDIT, 
   DESCR, DESCR2, FLAG, 
   USERNM, CREATDT, YEAR, 
   TYPE, ISCHANGE, ISNEW, 
   INVOICE_CODE, INVOICE_TYPE, INVKEYFLD, 
   GRPNO, REFERNO, REFERCODE, 
   REFERTYPE, COSTCENT, REFERKEYFLD,fcdebit,fccredit)
VALUES (
'JAN_TO_MAR_2005',-1,1,
   1, DT, PS, 
   acc, abs(amt)	, 0, 
   'OPENING BALANCE , P/L ', acnm, flg, 
   USER, SYSDATE, '2003', 
   1, 'Y', 'Y', 
   1, 1, NULL, 
   NULL, NULL, NULL, 
   NULL, NULL, NULL,abs(amt),0);
ELSE
INSERT INTO ACVOUCHER2 (
   PERIODCODE, KEYFLD, NO, 
   VOU_CODE, VOU_DATE, POS, 
   ACCNO, DEBIT, CREDIT, 
   DESCR, DESCR2, FLAG, 
   USERNM, CREATDT, YEAR, 
   TYPE, ISCHANGE, ISNEW, 
   INVOICE_CODE, INVOICE_TYPE, INVKEYFLD,
   GRPNO, REFERNO, REFERCODE, 
   REFERTYPE, COSTCENT, REFERKEYFLD,fcdebit,fccredit)
VALUES(
   'JAN_TO_MAR_2005', -1,1, 
   1, DT, PS, 
   ACC, 0,ABS(AMT),
   'OPENING BALANCE P/L ', ACNM, flg, 
   USER, SYSDATE, '2003', 
   1, 'Y', 'Y', 
   1, 1,NULL, 
   NULL, NULL, NULL, 
   NULL, NULL, NULL,0,abs(amt));
end if;
end;
/

alter trigger pass_vou2 enable;

	