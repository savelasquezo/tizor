import os

from openpyxl import Workbook
from openpyxl import load_workbook

from datetime import date
from django.conf import settings

from django_cron import CronJobBase, Schedule
from django.db.models import F
from django.utils import timezone

from apps.src.models import Account


class AddFunds(CronJobBase):
    RUN_EVERY_MINS = 1

    schedule = Schedule(run_every_mins=RUN_EVERY_MINS)
    code = 'apps.src.AddFunds'
    
    #crontab -e
    #* * * * * /apps/tizorminer/venv/bin/python /apps/tizorminer/core/manage.py runcrons
    def do(self):
        
        Date = timezone.now().strftime("%Y-%m-%d %H:%M")
        
        with open(os.path.join(settings.BASE_DIR, 'logs/logcron.txt'), 'a') as f:
            f.write("ServiceCron Active {}\n".format(Date))

        accounts = Account.objects.all()

        for obj in accounts:
            
            dayli_interest = float((obj.interest)/(100*30))
            dayli_ammount = int(obj.ammount*(dayli_interest))
            available = int(obj.total-obj.paid + dayli_ammount)
            obj.available = available
            obj.save()
                        
            FileName = '/home/savelasquezo/apps/vrt/core/logs/users/'+ obj.username + '.xlsx'
            
            try:
                if not os.path.exists(FileName):
                    WB = Workbook()
                    WS = WB.active
                    WS.append(["Tipo","Date","$Dayli","Aviable","AcComisiones","$Ticket","Origen","Total"])
                else:
                    WB = load_workbook(FileName)
                    WS = WB.active
                
                cTotal = nUser.total
                cAviableRef = nUser.ref_available

                FileData = [1, NowToday, cValue, cTodayRef, cAvailable, cAviableRef, "", "", cTotal]

                WS.append(FileData)
                WB.save(FileName)
                
            except Exception as e:
                with open(os.path.join(settings.BASE_DIR, 'logs/workbook.txt'), 'a') as f:
                    f.write("CronJob WorkbookError: {}\n".format(str(e)))

cronjobs = [
    AddFunds,
]