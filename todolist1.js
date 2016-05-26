ClientsList = new Mongo.Collection("clients");


if (Meteor.isClient) {


  //The Meteor.subscribe function is used on the client-side to retrieve the data that’s published from the server (meteor publish)
  Meteor.subscribe('theClients');
  

  ///////////
  /// HELPERS 
  ////////////


  Template.mainlist.helpers({

    //returns each client in database (lists posts)
    "client": function(){
      var currentUserId = Meteor.userId();//user id
      return ClientsList.find();//return posts
    }
    
  });


  ///////////
  ////EVENTS
  ///////////




  // submit clients
  Template.addClientForm.events({

    // Get form data
    "submit .js-saveClientForm":function(event){
        event.preventDefault();// stop the form submit from reloading the page
      console.log("Form submitted");       
        var name;
        name = event.target.clientName.value;//get field data
        Meteor.call('insertClientData' , name);//calling the server method after removing insecure package, passing form variable as argument for use on server
         // Clear form
      event.target.clientName.value = '';  

    }

  });




  // remove clients
  Template.mainlist.events({

    "click .js-remove":function(event){
      console.log("delete pushed");
      var client_id = this._id;
      console.log(client_id);
      Meteor.call('removeClientData' , client_id);
         
   
    },

    });



  // edit clients

  Template.editForm.events({

       // Edit form data
    "submit .js-editClientForm":function(event){

      event.preventDefault();// stop the form submit from reloading the page
      console.log("Form submitted");
    
      var name2 = event.target.clientedit.value;
      var client_id = this._id; 
       //  update data  
        Meteor.call('editClientData' , name2 , client_id);        

       // Clear form
      event.target.clientedit.value = '';

    }

  });




}//end meteor is client








if (Meteor.isServer) {

  Meteor.startup(function () {
    // code to run on server at startup
  });





  //The Meteor.publish function is used on the server-side to define what data should be available to users of the application (after removing autopublish)
  //each user will only see his own data
  Meteor.publish('theClients', function(){
  var currentUserId = this.userId;
  return ClientsList.find({createdby: currentUserId})
  });



  //after removing insecure package, crud needs to run through methods on server
  Meteor.methods({
      'insertClientData': function(name){

            var currentUserId = Meteor.userId();//user id
            //  Save data     
            ClientsList.insert({
              name: name,
              createdby: currentUserId,
            });      
        },

        'removeClientData': function(client_id){
          
          
          ClientsList.remove({"_id":client_id}); 


        },
         'editClientData': function(name2 , client_id){

            ClientsList.update({_id:client_id}, 
               {$set: {name:name2}});     
        },






  }); //end methods







  }//end server
