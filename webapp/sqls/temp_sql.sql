update pur2
set price=price/1.3
where invoice_code=21



declare 
cursor ii is select keyfld from pur1 where invoice_code=21 order by keyfld; 
begin
for x in ii loop
x_post_sale_invoice(x.keyfld);
end loop;
end;


declare
cursor ii is select sum((price/pack)*allqty) amt,keyfld from pur2 where invoice_code=21 group by keyfld order by keyfld;
begin
for x in ii loop
update pur1 set inv_amt=x.amt where keyfld=x.keyfld;
end loop;
end;


begin
repost_complete;
end;


UPDATE acvoucher1
SET descr=SUBSTR(descr,1,10)||' XXXXX';

create table acaccount_back as select *from acaccount 

UPDATE acaccount
SET name=SUBSTR(name,1,10)||' XXXXX' where childcount=0

update acaccount
set name=replace(name,'XXXXX','**') WHERE NAME LIKE '%XXXXX%'
