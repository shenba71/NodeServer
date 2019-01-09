const express = require('express');
const pg = require('pg');
const connectionString = 'postgres://localhost:5432/postgres';
 const client = new pg.Client({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'aspire@123',
    port: 5432
 });
var config = {
   user: 'postgres',
   host: 'localhost',
   database: 'jasperserver', 
   password: 'postgres', 
   port: 5434, 
   max: 10, // max number of connection can be open to database
   idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
 };
 var pool = new pg.Pool(config);
// const bodyParser = require('body-parser');
const http = require('http');
const app = express();
var mongoose = require('mongoose');
const router = express.Router();
require('../model/user-session.js');
require('../model/user-fields.js');
require('../model/audit.js');

var Fields =mongoose.model('fields');
var audit = mongoose.model('reportsaudits');
var UserSessionModel=mongoose.model('pearsonusers');
var model;
console.log("user session controller");


// fetch 

 router.post('/customfetch',(req,res)=>{
    
    console.log(req.body);
    UserSessionModel.aggregate([  
        {  
            "$match":{  
                "organizationId":{  
                    "$in":[  
                       "8a97b1ce6397de140164403619b52cad",
                       "8a97b1cc64cd6b350164ef276faf08f2",
                       "8a97b1a66397d9ec01647e6ef9a441b4", 
                       ""
                       
                    ]
                 },
                 "userRole":{  
                    "$in":[  
                       "S",
                       "s",
                       "t",
                       "T", 
                       ""
                    ]
                 },
               "dayId":{  
                  "$gte":req.body.date.startDate,
                  "$lte":req.body.date.endDate
               }
            }
         },
         {  
            "$group":{  
               "_id":{  
                  "date":"$date",
                  "userRole":"$userRole",
                  "platformId" : "$platformId"
               },
               "totalLoginCount":{  
                  "$sum": "$result.userLoginCount"   }
            }
         },
         {  
            "$project":{  
               "_id":0,
               "loginDate":{  
                  $dateToString:{  
                     format:"%d/%m/%Y",
                     date:"$_id.date"
                  }
               },
               "userRole":"$_id.userRole", 
               "totalLoginCount": "$totalLoginCount" ,
                "platformId" : "$_id.platformId"


            }
         }
     ],
     (err,data)=>{
         res.send(data);

     });
 });

 function isValidDate(date) {
   return date && Object.prototype.toString.call(date) === "[object Date]" && !isNaN(date);
 }

// function getResults(req,res){
//    client.connect();
//      let results = [];
//      const query = client.query('SELECT * FROM public.report_details');
//     // Stream results back one row at a time
//      query.on('row', (row) => {
//         results.push(row);
//       });
     
//       // After all data is returned, close connection and return results
//       query.on('end', () => {
//          //done();
//          return res.json(results);
//          // setTimeout(() => {
//          //    //client.end();
//          //    //document()
            
//          // }, 1200);
         
//       });
// }

router.get('/fetchAudit', function (req, res) {
   pool.query("SELECT rj.id AS Job_Id, rj.label as Job_Name, rj.base_output_name as Report_Name, (case	when qt.prev_fire_time = -1 then null else to_timestamp(qt.prev_fire_time / 1000)::timestamp without time zone end )Last_Run_Time,	( CASE WHEN le.id > 0 AND rj.creation_date < Now() THEN 'Failure' WHEN qt.prev_fire_time = -1 THEN 'Scheduled' ELSE 'Success' END ) AS status, (case when qt.next_fire_time = -1 then null else to_timestamp(qt.next_fire_time / 1000)::timestamp without time zone end) Next_Run_Time, ( CASE WHEN rj.content_destination > 0 and jrd.server_name is not null THEN 'true' ELSE 'false' END ) AS Is_FTP_Enabled, ( CASE WHEN rj.mail_notification > 0 THEN 'true' ELSE 'false' END ) AS Is_Notification_Enabled FROM  public.jireportjob rj  left join jilogevent le ON rj.report_unit_uri = le.resource_uri AND le.event_text LIKE '%ID: ' ||rj.id ||')%' left join public.qrtz_triggers qt on concat('job_',rj.id::text) = qt.job_name left join public.jireportjobmailrecipient jmr	on rj.mail_notification = jmr.destination_id and recipient_type=1 left join jireportjobrepodest jrd on rj.content_destination = jrd.id;", 
   (error, results) => {
      if (error) {
        throw error
      }
      var rows = results.rows;
      for (var i = 0; i< rows.length; i++){
         for( var j in rows[i] ) {
         if (rows[i].hasOwnProperty(j)) {
            if(isValidDate(rows[i][j])) {
            rows[i][j] = rows[i][j].toLocaleString();
           }
            
         }
      }
   }
      res.status(200).json(rows);
    })
});

router.get('/fetchAuditDetails', (req,res)=>{
   console.log('fetching audit detaiils');
   getResults(req,res);
   //res.send(results);
   // audit.find({},(err,data)=>{
   //     console.log('fecthing audit records '+ data);
   //     if(data){
   //        res.send(data);
   //     }else{
   //        console.log('No records Found');
   //        res.send(data);
   //     }
   //  })
})

router.post('/fetchFields',(req,res)=>{
    Fields.find({},(err,data)=>{
        res.send(data);
    })
});

 router.post('/add',(req,res)=>{
    model= new UserSessionModel(req.body);
    model.save().then(()=>{
        res.json("registerSucess");
     });                
 });

 //to fetch all fields and data
 router.get('/all',(req,res)=>{
    console.log("hi");
     console.log(req.headers.jso);
     UserSessionModel.find({},(err,data)=>{
         res.send(data);
     });
 });

 router.get('/tableReport',(req,res)=>{
     UserSessionModel.aggregate([  
        {  
           "$match":{  
              "organizationId":{  
                 "$in":[  
                    "8a97b1ce6397de140164403619b52cad",
                    "8a97b1cc64cd6b350164ef276faf08f2",
                    "8a97b1a66397d9ec01647e6ef9a441b4", 
                    ""
                    
                 ]
              },
              "userRole":{  
                 "$in":[  
                    "S",
                    "s",
                    "t",
                    "T", 
                    ""
                 ]
              },
              "dayId":{  
                 "$gte":20180101,
                 "$lte":20181129
              }
           }
        },
        {  
           "$group":{  
              "_id":{  
                 "date":"$date",
                 "userRole":"$userRole",
            "platformId" : "$platformId"
              },
              "totalLoginCount":{  
                 "$sum": "$result.userLoginCount"   }
           }
        },
        {  
           "$project":{  
                _id:"$_id",
              "loginDate":{  
                 $dateToString:{  
                    format:"%d/%m/%Y",
                    date:"$_id.date"
                 }
              },
            
              "TeacherLogin":
                    {
                      $cond: {if:
                      { $or: [ { $eq: [ "$_id.userRole", "t" ] }, { $eq: [ "$_id.userRole", "T" ] } ] 
                      }, then : "$totalLoginCount", else: 0 
                    }},
                    
         "StudentLogin":
                    {
                      $cond: {if:
                      { $or: [ { $eq: [ "$_id.userRole", "s" ] }, { $eq: [ "$_id.userRole", "S" ] } ] 
                      }, then : "$totalLoginCount", else: 0 
                    }},
                    
           "AdminLogin":
                    {
                      $cond: {if:
                      { $or: [ { $eq: [ "$_id.userRole", "admin" ] }, { $eq: [ "$_id.userRole", "Admin" ] } ] 
                      }, then : "$totalLoginCount", else: 0 
                    }}
     
     
           }
        }
     ],
     (err,data)=>{
        res.send(data);

    })
 });


 //custom field fetch

    router.post('/customFields',(req,res)=>{
        UserSessionModel.aggregate([  
            {  
               "$match":{  
                  "organizationId":{  
                     "$in":[  
                        "8a97b1ce6397de140164403619b52cad",
                        "8a97b1cc64cd6b350164ef276faf08f2",
                        "8a97b1a66397d9ec01647e6ef9a441b4", 
                        ""
                        
                     ]
                  },
                  "userRole":{  
                     "$in":[  
                        "S",
                        "s",
                        "t",
                        "T", 
                        ""
                     ]
                  },
                  "dayId":{  
                     "$gte":20180101,
                     "$lte":20181129
                  }
               }
            },
            {  
               "$group":{  
                  "_id":{  
                     "date":"$date",
                     "userRole":"$userRole",
                "platformId" : "$platformId"
                  },
                  "totalLoginCount":{  
                     "$sum": "$result.userLoginCount"   }
               }
            },
            {  
               "$project":{  
                    _id:"$_id",
                  "loginDate":{  
                     $dateToString:{  
                        format:"%d/%m/%Y",
                        date:"$_id.date"
                     }
                  },
                
                  "TeacherLogin":
                        {
                          $cond: {if:
                          { $or: [ { $eq: [ "$_id.userRole", "t" ] }, { $eq: [ "$_id.userRole", "T" ] } ] 
                          }, then : "$totalLoginCount", else: 0 
                        }},
                        
             "StudentLogin":
                        {
                          $cond: {if:
                          { $or: [ { $eq: [ "$_id.userRole", "s" ] }, { $eq: [ "$_id.userRole", "S" ] } ] 
                          }, then : "$totalLoginCount", else: 0 
                        }},
                        
               "AdminLogin":
                        {
                          $cond: {if:
                          { $or: [ { $eq: [ "$_id.userRole", "admin" ] }, { $eq: [ "$_id.userRole", "Admin" ] } ] 
                          }, then : "$totalLoginCount", else: 0 
                        }}
         
         
               }
            }
         ],
         (err,data)=>{
            res.send(data);
    
        })
    });



module.exports=router;
