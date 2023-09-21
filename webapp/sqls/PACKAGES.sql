DROP PACKAGE CP_ACC;

CREATE OR REPLACE PACKAGE    CP_ACC
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

end;
/


DROP PACKAGE CP_ACCBAL_GL_TRANS;

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


DROP PACKAGE CP_ACCBAL_GL_TRANS_MONTHLY;

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


DROP PACKAGE CP_ACC_PL;

CREATE OR REPLACE PACKAGE    CP_ACC_PL
AS
pfromdt date:=to_date('01/01/2000','dd/mm/rrrr');
ptodt date:=sysdate;
pfromacc varchar2(100);
ptoacc varchar2(100);
pfromcust varchar2(100);
ptocust varchar2(100);
pacpath varchar2(4000);

plevelno integer:=0;
pisAll varchar2(10):='Y';
plastuid varchar2(300);
PUNPOSTED varchar2(10);
pcc varchar2(10);

procedure build_gl(uid varchar2);

end;
/


DROP PACKAGE CP_ACC_PL_MONTHLY;

CREATE OR REPLACE PACKAGE    CP_ACC_PL_MONTHLY
AS
pfromdt date:=to_date('01/01/2000','dd/mm/rrrr');
ptodt date:=sysdate;
pfromacc varchar2(100);
ptoacc varchar2(100);
pfromcust varchar2(100);
ptocust varchar2(100);
pacpath varchar2(4000);
plevelno integer:=0;
pisAll varchar2(10):='Y';
plastuid varchar2(300);
punposted VARCHAR2(100):='N';
pcc varchar2(100):=''; -- costcent

procedure build_gl(uid varchar2);

end;
/



DROP PACKAGE BODY CP_ACC;

CREATE OR REPLACE PACKAGE BODY    CP_ACC AS

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
  cursor rps(pa varchar2) is select code,name,namea,path,ac_no,parentcustomer,childcount,levelno from c_ycust where ac_no=pa and childcount=0 order by path; 
begin
if (pfromacc is not null) then
  select path into pacpath from acaccount where accno=pfromacc;
  else
  pacpath:='';
end if;
  for rx in rpac loop
   cnt_acns:=cnt_acns+1;
   acns(cnt_acns):=rx.ac_no;     
  end loop;
  CP_ACCBAL_GL_TRANS.PFROMDT:=pfromdt;
  CP_ACCBAL_GL_TRANS.PTODT:=ptodt;
  CP_ACCBAL_GL_TRANS.PUNPOSTED:=PUNPOSTED;
  CP_ACCBAL_GL_TRANS.pcc:=pcc;
  CP_ACCBAL_GL_TRANS.build_accs;
  
  if prnp='Y' then
    CP_CUST_TRANS.PFROMDT:=pfromdt;
    CP_CUST_TRANS.PTODT:=ptodt;
    CP_CUST_TRANS.PUNPOSTED:=PUNPOSTED;
    CP_CUST_TRANS.pcc:=pcc;
    CP_CUST_TRANS.build_accs;
  end if;    

  plastuid:=uid;
  delete from temporary where idno=66601 AND USERNM=UID;

  for x in acs
  loop

    bdr :=CP_ACCBAL_GL_TRANS.get_debit_sum_bf(x.path||'%');
	bcr :=CP_ACCBAL_GL_TRANS.get_credit_sum_bf(x.path||'%');
  	tdr :=CP_ACCBAL_GL_TRANS.get_debit_sum_t(x.path||'%');
  	tcr :=CP_ACCBAL_GL_TRANS.get_credit_sum_t(x.path||'%');
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
  	insert into temporary(idno,usernm,field1,field2,field3,field4,field5,field6,
		   				field7,field8,field9,field10,field11,
						field12,field13,field14,field15,field16,field17,field18,FIELD19)
						values
						(66601,uid,
						x.accno,
						x.name,
						bdr,bcr,bdr_bal,bcr_bal,
						tdr,tcr,tdr_bal,tcr_bal,
						edr,ecr,edr_bal,ecr_bal,posx,
						x.levelno,x.path,x.childcount,x.parentacc);
  if prnp='Y' then
  tmpfnd:=false;
  for rx in 1..cnt_acns loop
    if acns(rx)=x.accno then
     tmpfnd:=true;
     end if;
  end loop;
    if tmpfnd then
    for rx in rps(x.accno)
    loop
      bdr :=CP_CUST_TRANS.get_debit_sum_bf(rx.path||'%') ;
      bcr :=CP_CUST_TRANS.get_credit_sum_bf(rx.path||'%');
      tdr :=CP_CUST_TRANS.get_debit_sum_t(rx.path||'%');
      tcr :=CP_CUST_TRANS.get_credit_sum_t(rx.path||'%');
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
      insert into temporary(idno,usernm,field1,field2,field3,field4,field5,field6,
                           field7,field8,field9,field10,field11,
                        field12,field13,field14,field15,field16,field17,field18,FIELD19)
                        values
                        (66601,uid,
                        rx.code,
                        rx.name,
                        bdr,bcr,bdr_bal,bcr_bal,
                        tdr,tcr,tdr_bal,tcr_bal,
                        edr,ecr,edr_bal,ecr_bal,posx,
                        rx.levelno,x.path||'\'||rx.code,rx.childcount,x.accno);
    end loop;          
   end if;                                                       
  end if;
  end loop;
end;

END;
/


DROP PACKAGE BODY CP_ACCBAL_GL_TRANS;

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


DROP PACKAGE BODY CP_ACCBAL_GL_TRANS_MONTHLY;

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


DROP PACKAGE BODY CP_ACC_PL;

CREATE OR REPLACE PACKAGE BODY    CP_ACC_PL AS
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
  (levelno<=plevelno or plevelno=0) and closeacc=pfromacc and actype=0 ORDER BY PATH; 
cursor acspl(pth1 varchar2) is select accno,path,levelno,name,childcount,parentacc from 
acaccount where 
   path like pth1||'%' and path!=pth1 and actype=1 ORDER BY PATH;
   
  bdr number:=0; 
  bcr number:=0;
  bbdr number:=0; 
  bbcr number:=0; 
   
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
   
  totdr number:=0; 
  totcr number:=0; 
  vtotdr number:=0; 
  vtotcr number:=0;
  totbdr number:=0;
  totbcrd number:=0;

    vtotbdr number:=0; 
  vtotbcr number:=0;

 plstr varchar2(100):='';
 curp varchar2(100):=repair.getcurperiodcode();
 period_from date;
begin 

select max(fromdate) into period_from from fiscalperiod where code=curp;

if (pfromacc is not null) then 
  select path into pacpath from acaccount where accno=pfromacc; 
  else 
  pacpath:=''; 
end if;

  CP_ACCBAL_GL_TRANS.PFROMDT:=nvl(pfromdt,period_from); 
  CP_ACCBAL_GL_TRANS.PTODT:=ptodt;
  CP_ACCBAL_GL_TRANS.PUNPOSTED:=PUNPOSTED;
  CP_ACCBAL_GL_TRANS.pcc:=pcc;
  CP_ACCBAL_GL_TRANS.build_accs;
  

  plastuid:=uid; 
  delete from temporary where idno=66602 AND USERNM=UID; 
   
  for x in acs 
  loop

    bdr :=0;--CP_ACCBAL_GL_TRANS.get_debit_sum_bf(x.path||'%'); 
    bcr :=0;--CP_ACCBAL_GL_TRANS.get_credit_sum_bf(x.path||'%');
    bbdr:=CP_ACCBAL_GL_TRANS.get_debit_sum_bf(x.path||'%'); 
    bbcr:=CP_ACCBAL_GL_TRANS.get_credit_sum_bf(x.path||'%');
      tdr :=CP_ACCBAL_GL_TRANS.get_debit_sum_t(x.path||'%'); 
      tcr :=CP_ACCBAL_GL_TRANS.get_credit_sum_t(x.path||'%'); 
      edr :=bdr+tdr; 
      ecr :=bcr+tcr; 
    bdr_bal:=0; bcr_bal:=0; 
    edr_bal:=0; ecr_bal:=0; 
    tdr_bal:=0; tcr_bal:=0; 
      if (bbdr-bbcr)>=0 then 
       bdr_bal :=(bbdr-bbcr); 
       else 
        bcr_bal:=abs(bbdr-bbcr); 
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
      insert into temporary(idno,usernm,field1,field2,field3,field4,field5,field6, 
                           field7,field8,field9,field10,field11, 
                        field12,field13,field14,field15,field16,field17,field18,FIELD19) 
                        values 
                        (66602,uid, 
                        x.accno, 
                        x.name, 
                        bbdr,bbcr,bdr_bal,bcr_bal, 
                        tdr,tcr,tdr_bal,tcr_bal, 
                        edr,ecr,edr_bal,ecr_bal,posx, 
                        x.levelno,x.path,x.childcount,x.parentacc); 
    if (x.levelno=1) then 
    totdr:=totdr+edr_bal; 
    totcr:=totcr+abs(ecr_bal);
    
    totbdr:=totbdr+bdr_bal;
    totbcrd:=totbcrd+bcr_bal; 
    end if;                         
  end loop; 
     
  --- for other closed account balances... 
  for x in acspl(pacpath) 
  loop 
  bdr:=0; 
  bcr:=0; 
  tcr:=0; 
  tdr:=0; 
    bdr_bal:=0; bcr_bal:=0; 
    edr_bal:=0; ecr_bal:=0; 
    tdr_bal:=0; tcr_bal:=0;

  SELECT NVL(SUM(DEBIT-CREDIT),0) INTO tdr FROM ACACCOUNT A,ACVOUCHER2 V 
     WHERE  vou_date>=nvl(pfromdt,period_from) and VOU_DATE<=ptodt and (v.costcent=pcc or pcc is null)
     AND V.ACCNO=A.ACCNO AND A.CLOSEACC=x.accno;

  SELECT NVL(SUM(DEBIT-CREDIT),0) INTO bbdr FROM ACACCOUNT A,ACVOUCHER2 V 
     WHERE  vou_date<nvl(pfromdt,period_from) and (v.costcent=pcc or pcc is null)
     AND V.ACCNO=A.ACCNO AND A.CLOSEACC=x.accno;


      if (tdr)>=0 then 
       tdr_bal :=(tdr); 
        plstr:='Periodic Loss '; 
       else 
        tcr_bal:=abs(tdr);
        plstr:='Periodic Profit '; 
    end if;

      if (bdr)>=0 then 
       bdr_bal :=(bbdr); 
       else 
        bcr_bal:=abs(bbdr);
      
    end if;
    if (bbdr+tdr)>0 then
      plstr:=plstr||', YTD Loss';
     else      
       plstr:=plstr||' YTD Profit ';
    end if;

    posx:=posx+1; 
      insert into temporary(idno,usernm,field1,field2,field3,field4,field5,field6, 
                           field7,field8,field9,field10,field11, 
                        field12,field13,field14,field15,field16,field17,field18,FIELD19,field20) 
                        values 
                        (66602,uid, 
                        x.accno, 
                        x.name||' '||plstr, 
                        bbdr,0,bdr_bal,bcr_bal, 
                        tdr,tcr,0,0, 
                        0,0,tdr_bal,tcr_bal,posx, 
                        -1,x.path,x.childcount,x.parentacc,1); 
    --if (x.levelno=1) then 
    totdr:=totdr+tdr_bal; 
    totcr:=totcr+abs(tcr_bal); 
    
    totbdr:=totbdr+bdr_bal;
    totbcrd:=totbcrd+bcr_bal;                             
  end loop; 
  

    if ((totdr!=totcr) or (totbdr!=totbcrd)) then 

    if (totdr-totcr)>0 then 
      vtotdr:=totdr-totcr;
              plstr:='(Loss)'; 
    else 
      vtotcr:=abs(totdr-totcr);
              plstr:='(Profit)';  
    end if;
    
    if (totbdr-totbcrd)>0 then 
      vtotbdr:=totbdr-totbcrd; 
    else 
      vtotbcr:=abs(totbdr-totbcrd);  
    end if;
    

    
    if (pcc is not null) then
     select max(title||'  '||titlea||' '||plstr) into plstr from accostcent1 where code=pcc;
    end if;
      insert into temporary(idno,usernm,field1,field2,field3,field4,field5,field6, 
                           field7,field8,field9,field10,field11, 
                        field12,field13,field14,field15,field16,field17,field18,FIELD19) 
                        values 
                        (66602,uid, 
                        '-', 
                        'Un-posted: '||plstr, 
                        totbdr,totbcrd,vtotbcr,vtotbdr, 
                        totcr,totdr,0,0, 
                        0,0,vtotcr,vtotdr,posx+1, 
                        -1,'',0,''); 
end if;   
end;

END;
/


DROP PACKAGE BODY CP_ACC_PL_MONTHLY;

CREATE OR REPLACE PACKAGE BODY    CP_ACC_PL_MONTHLY AS
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
  (levelno<=plevelno or plevelno=0) and closeacc=pfromacc and actype=0 ORDER BY PATH; 
cursor acspl(pth1 varchar2) is select accno,path,levelno,name,childcount,parentacc from 
acaccount where 
   path like pth1||'%' and path!=pth1 and actype=1 ORDER BY PATH;
   
cursor mnth is select distinct to_char(vou_date,'rrrr/mm') mnth from acvoucher2,acaccount
  where acvoucher2.accno=acaccount.accno and actype=0
  and acaccount.closeacc=pfromacc 
  and vou_date>=pfromdt and vou_date<=ptodt order by 1;
  
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
   
  totdr number:=0; 
  totcr number:=0; 
  vtotdr number:=0; 
  vtotcr number:=0;

begin 
if (pfromacc is not null) then 
  select path into pacpath from acaccount where accno=pfromacc; 
  else 
  pacpath:=''; 
end if;

  CP_ACCBAL_GL_TRANS_MONTHLY.PFROMDT:=pfromdt; 
  CP_ACCBAL_GL_TRANS_MONTHLY.PTODT:=ptodt;
  CP_ACCBAL_GL_TRANS_MONTHLY.punposted:=punposted;
  CP_ACCBAL_GL_TRANS_MONTHLY.pcc:=pcc;
  CP_ACCBAL_GL_TRANS_MONTHLY.build_accs;

  plastuid:=uid; 
  delete from temporary where idno=66602 AND USERNM=UID; 
   
for mx in mnth loop  
totdr:=0;tdr_bal:=0; tcr_bal:=0;
totcr:=0;
  for x in acs 
  loop  
    bdr :=0;--CP_ACCBAL_GL_TRANS_MONTHLY.get_debit_sum_bf(x.path||'%'); 
    bcr :=0;--CP_ACCBAL_GL_TRANS_MONTHLY.get_credit_sum_bf(x.path||'%'); 
      tdr :=CP_ACCBAL_GL_TRANS_MONTHLY.get_debit_sum_t(x.path||'%',mx.mnth); 
      tcr :=CP_ACCBAL_GL_TRANS_MONTHLY.get_credit_sum_t(x.path||'%',mx.mnth); 
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
      insert into temporary(idno,usernm,field1,field2,field3,field4,field5,field6, 
                           field7,field8,field9,field10,field11, 
                        field12,field13,field14,field15,field16,field17,field18,FIELD19,field30) 
                        values 
                        (66602,uid, 
                        x.accno, 
                        x.name, 
                        bdr,bcr,bdr_bal,bcr_bal, 
                        tdr,tcr,tdr_bal,tcr_bal, 
                        edr,ecr,edr_bal,ecr_bal,posx, 
                        x.levelno,x.path,x.childcount,x.parentacc,mx.mnth); 
    if (x.levelno=1) then 
    totdr:=totdr+edr_bal; 
    totcr:=totcr+abs(ecr_bal); 
    end if;                         
  end loop; 
     
  --- for other closed account balances... 
  for x in acspl(pacpath) 
  loop 
  bdr:=0; 
  bcr:=0; 
  tcr:=0; 
  tdr:=0; 
    bdr_bal:=0; bcr_bal:=0; 
    edr_bal:=0; ecr_bal:=0; 
    tdr_bal:=0; tcr_bal:=0;

SELECT NVL(SUM(DEBIT),0), nvl(sum(CREDIT),0) INTO tdr,tcr FROM ACACCOUNT A,ACVOUCHER2 V 
    WHERE  to_char(VOU_DATE,'rrrr/mm')=mx.mnth 
     AND V.ACCNO=A.ACCNO AND A.CLOSEACC=x.accno;
    
    if (tdr-tcr)>0 then
      tdr_bal:=tdr-tcr;
      else
      tcr_bal:=abs(tdr-tcr);
      end if;
    posx:=posx+1; 
      insert into temporary(idno,usernm,field1,field2,field3,field4,field5,field6, 
                           field7,field8,field9,field10,field11, 
                        field12,field13,field14,field15,field16,field17,field18,FIELD19,field20,field30) 
                        values 
                        (66602,uid, 
                        x.accno, 
                        x.name, 
                        0,0,0,0, 
                        tdr,tcr,0,0, 
                        0,0,tdr_bal,tcr_bal,posx, 
                        1,x.path,x.childcount,x.parentacc,1,mx.mnth); 
---    if (x.levelno=1) then 
    totdr:=totdr+tdr_bal; 
    totcr:=totcr+tcr_bal; 
--    end if;    
    dbms_output.put_line(mx.mnth||'-->totdr-> '||totdr||' totcr ->'||totcr);
   end loop;
   
  if (totdr!=totcr) then 
    if (totdr-totcr)>0 then 
      vtotdr:=totdr-totcr; 
    else 
      vtotcr:=abs(totdr-totcr); 
    end if;   
      insert into temporary(idno,usernm,field1,field2,field3,field4,field5,field6, 
                           field7,field8,field9,field10,field11, 
                        field12,field13,field14,field15,field16,field17,field18,FIELD19,field30) 
                        values 
                        (66602,uid, 
                        '-', 
                        'Red=profit , green=loss', 
                        0,0,0,0, 
                        totdr,totcr,0,0, 
                        0,0,vtotcr,vtotdr,posx+1, 
                        1,'',0,'',mx.mnth); 
end if;                            

end loop; 
  

   
   
   
   
   
end;

END;
/


