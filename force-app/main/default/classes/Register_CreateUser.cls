global class Register_CreateUser {



@InvocableMethod(label='Create User')
     public static List<String> doCreateUser(List<CreateUserInput> requests) {
         system.debug ('experienceid: ');
         system.debug(Site.getExperienceId());
         CreateUserInput request = requests[0];

         Account actmilwaukee = [Select Id from Account where Name='Milwaukee' limit 1];
         Account actryobi = [Select Id from Account where Name='Ryobi' limit 1];
         Profile p = [Select Id from Profile where Name='Customer Community Login User'];
         


        String orgId = UserInfo.getOrganizationId();
        String dateString = String.valueof(Datetime.now()).replace(' ','').replace(':','').replace('-','');
        Integer randomInt = Integer.valueOf(math.rint(math.random()*1000000));
        String uniqueName = orgId + dateString + randomInt;
        if(uniqueName.length()>51)
        {
            uniqueName=uniqueName.substring(0,51);
        }

        String nickname = request.firstName == null?String.valueOf(Integer.valueOf(math.random()*10000)):(request.FirstName.substring(0, 3) + Integer.valueof(math.random()*10000));
         String FirstName = request.firstName == null?'':request.firstName;
        

System.debug('about to create user with nickname of ' + nickname);
        User user1 = new User(

                FirstName = request.firstName == null?'':request.firstName,
                LastName = request.LastName == null?request.email.substringBefore('@'):request.LastName,
                Alias = nickname,
                email = request.email,
                ProfileId = p.Id,
                EmailEncodingKey = 'UTF-8',
                CommunityNickname = nickname,
                TimeZoneSidKey = 'Europe/London',
                LocaleSidKey ='en_GB',
                LanguageLocaleKey = 'en_US'
        );

        String userId;
        String password = request.password;

         if (password != null){
             user1.UserName = request.email+ '.milwaukee.demo';
             user1.site__c = 'Milwaukee';
             userId = Site.createExternalUser(user1, actmilwaukee.Id, password, true);
         	Contact newcontact = [Select Id, MailingCity, MailingStreet, MailingPostalCode, MailingState, MailingCountry,
                                 Consent__c from Contact where Id in (Select ContactId from User where Id = :userId) ];

            newcontact.site__c = 'Milwaukee';
             update newcontact;
	//		PageReference pr = doLoginUser(user1.Username, request.password);
	         System.debug('Created Contact and User');
         }
         else {
             user1.UserName = request.email+ '.ryobi.demo';
             user1.site__c = 'Ryobi';
     		userId = Site.createExternalUser(user1, actryobi.Id);  
                  	Contact ct = [Select Id, MailingCity, MailingStreet, MailingPostalCode, MailingState, MailingCountry,
                                 Consent__c from Contact where Id in (Select ContactId from User where Id = :userId) ];

         	ct.FirstName = user1.FirstName;
             ct.LastName = user1.LastName;
             ct.site__c = 'Ryobi';
             ct.Email = user1.Email;
             ct.MailingCity = request.city;
             ct.MailingStreet = request.street;
             ct.MailingCountry = request.country;
             ct.MailingPostalCode = request.postcode;
             ct.MailingState = request.state;
             ct.Consent__c = request.consent;
             update ct;

	
         System.debug('Created Contact and User only');
         }

         List<String> results = new List<String>();
         results.add('OK');
         
         return results;
    }
         private static PageReference doLoginUser(String username, String password) {
         return Site.login (username, password,  'sdodemo-main-166ce2cf6b6-172-175fa6a7bb9.force.com/s/login/');
         }
    


global class CreateUserInput {

        @InvocableVariable
        public String firstName ;

        @InvocableVariable
        public String lastName ;

        @InvocableVariable
        public String email ;

        @InvocableVariable
        public String password ;
    
        @InvocableVariable
        public String street ; 
    
        @InvocableVariable
        public String city ;
    
        @InvocableVariable
        public String state ;
    
        @InvocableVariable
        public String country ;
    
        @InvocableVariable
        public String postcode ; 
    
        @InvocableVariable
        public Boolean consent ;  
    
    
    }
}