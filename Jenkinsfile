pipeline {

   agent { label 'generic' }
   
   tools { nodejs 'node.js 12' }

   stages {
      
      stage('Node Build') {
         steps {
            sh 'npm install'
         }
      }

      stage('Test_Checkmarx') {
         when {
            branch 'dev'
         }
         steps {
            echo 'Testing Checkmarx...'
            step([$class: 'CxScanBuilder', comment: '', configAsCode: true, credentialsId: 'Checkmarx_Cred', customFields: '', excludeFolders: '', exclusionsSetting: 'global', failBuildOnNewResults: false, failBuildOnNewSeverity: 'HIGH', filterPattern: '''!**/_cvs/**/*, !**/.svn/**/*, !**/.hg/**/*, !**/.git/**/*, !**/.bzr/**/*,
            !**/.gitgnore/**/*, !**/.gradle/**/*, !**/.checkstyle/**/*, !**/.classpath/**/*, !**/bin/**/*,
            !**/obj/**/*, !**/backup/**/*, !**/.idea/**/*, !**/*.DS_Store, !**/*.ipr, !**/*.iws,
            !**/*.bak, !**/*.tmp, !**/*.aac, !**/*.aif, !**/*.iff, !**/*.m3u, !**/*.mid, !**/*.mp3,
            !**/*.mpa, !**/*.ra, !**/*.wav, !**/*.wma, !**/*.3g2, !**/*.3gp, !**/*.asf, !**/*.asx,
            !**/*.avi, !**/*.flv, !**/*.mov, !**/*.mp4, !**/*.mpg, !**/*.rm, !**/*.swf, !**/*.vob,
            !**/*.wmv, !**/*.bmp, !**/*.gif, !**/*.jpg, !**/*.png, !**/*.psd, !**/*.tif, !**/*.swf,
            !**/*.jar, !**/*.zip, !**/*.rar, !**/*.exe, !**/*.dll, !**/*.pdb, !**/*.7z, !**/*.gz,
            !**/*.tar.gz, !**/*.tar, !**/*.gz, !**/*.ahtm, !**/*.ahtml, !**/*.fhtml, !**/*.hdm,
            !**/*.hdml, !**/*.hsql, !**/*.ht, !**/*.hta, !**/*.htc, !**/*.htd, !**/*.war, !**/*.ear,
            !**/*.htmls, !**/*.ihtml, !**/*.mht, !**/*.mhtm, !**/*.mhtml, !**/*.ssi, !**/*.stm,
            !**/*.bin,!**/*.lock,!**/*.svg,!**/*.obj,
            !**/*.stml, !**/*.ttml, !**/*.txn, !**/*.xhtm, !**/*.xhtml, !**/*.class, !**/*.iml, !Checkmarx/Reports/*.*,
            !OSADependencies.json, !**/node_modules/**/*''', fullScanCycle: 10, generatePdfReport: true, groupId: '53', password: '{AQAAABAAAAAQmjNhbGgdCpMZP4oyrcwv38pEN1QExKMCWZ7TLlhmstw=}', preset: '36', projectName: 'Pizzas_API', sastEnabled: true, serverUrl: 'https://cxprivatecloud.checkmarx.net/', sourceEncoding: '6', useOwnServerCredentials: true, username: '', vulnerabilityThresholdResult: 'FAILURE', waitForResultsEnabled: true])
         }
      }

      stage('Test_Kiuwan') {
         when {
            branch 'qa';
         }
         steps {
            echo 'Testing Kiuwan...'
            kiuwan applicationName: 'Pizzas API', connectionProfileUuid: '5PIH-WqhL', failureThreshold: 60.0, label: '00008', sourcePath: '/home/jenkins/jenkins_slave/workspace/ceTsoft_PizzasAPIMultibranch_dev', unstableThreshold: 96.0
         }
      }

      stage('Test_Snyk_SCA') {
         when {
            branch 'qa';
         }
         steps {
            echo 'Testing Snyk SCA...'
            snykSecurity(
               snykInstallation: 'snyk@latest',
               snykTokenId: 'Id_Snyk_Cred',
               failOnIssues: false,
            )
         }
      }

      stage('Test_Snyk_SAST') {
         when {
            branch 'qa';
         }
         steps {
            echo 'Testing Snyk SAST...'
            snykSecurity(
               snykInstallation: 'snyk@latest',
               snykTokenId: 'Id_Snyk_Cred',
               additionalArguments: '--code',
               failOnIssues: false,
            )
         }
      }

      stage('Package') {
         when {
            anyOf {
               branch 'dev'
               branch 'qa'
               branch 'main'
            }
         }
         steps {
            sh 'serverless package'
         }
      }

      stage('Deploy to DEV') {
         when {
            branch 'dev'
         }
         steps {
            sh 'sls deploy --stage dev'
         }
      }

      stage('Deploy to QA') {
         when {
            branch 'qa'
         }
         steps {
            sh 'sls deploy --stage qa'
         }
      }

      stage('Deploy to Production') {
         when {
            branch 'main'
         }
         steps {
            sh 'sls deploy --stage prod'
         }
      }
   }
}