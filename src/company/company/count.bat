@Rem: ����������������ĳ��·���µ����ļ����������������������ļ��㲻�����  
@Rem: author: ФФ xiaoxia.xuxx@alibaba-inc.com  
@echo ****************************************************************  
@echo off  
@echo ʹ��˵����  
@echo 1������Ҫ�����·������filePath��·������Ϊ�Լ�����Ҫ��·����  
@echo 2������ͳ�Ƶ��ļ���׺�������Ҫͳ�������ļ���fileExt����Ϊ*,���ֻ��Ҫͳ��php�ļ��򽫸ñ���ָ��Ϊ*.php  
@echo ****************************************************************  
  
@set fileExt=*.js  
@set filePath=d:\nodejs\company\company  
  
@setlocal enabledelayedexpansion  
@set filenum=0  
@set totalnum=0  
@for /r %filePath% %%i in (%fileExt%) do (  
    @set linenum=0 & @set /a filenum+=1 & @echo %%i & (@for /f "usebackq" %%b in (%%i) do @set /a linenum+=1) & @echo ������!linenum! & @set /a totalnum+=linenum)  
  
@echo ������: %totalnum%��  
@echo ���ļ���: %filenum%  
@pause  