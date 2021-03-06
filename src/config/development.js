'use strict';

module.exports = {
    "port" : 8001,
    "debug_mode" : "DEBUG",
    "mongodb" : {
        "conn1" : {
            "path" : "mongodb://172.16.34.14/test",
            "options" : {
                "user" : "test1",
                "pass" : "test1pwd",
                "port" : 27017
            }
        },
        "conn2" : {
            "path" : "mongodb://172.16.34.14/test",
            "options" : {
                "user" : "test1",
                "pass" : "test1pwd",
                "port" : 27017
            }
        }
    },
    "redis" : {
        "redis_db0" : {
            "host" : "172.16.34.14",
            "port" : 6379,
            "password" : "redispwd",
            "db" : 0
        },
        "redis_db1" : {
            "host" : "172.16.34.14",
            "port" : 6379,
            "password" : "redispwd",
            "db" : 1
        }
    },


}