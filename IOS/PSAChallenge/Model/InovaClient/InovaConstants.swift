//
//  InovaConstants.swift
//  PSAChallenge
//
//  Created by Igor Clemente on 24/09/2018.
//  Copyright © 2018 Igor Clemente. All rights reserved.
//

import Foundation

extension InovaClient {
    
    struct Constants {
        static let ApiScheme = "http"
        static let ApiHost = "ec2-34-201-112-184.compute-1.amazonaws.com"
        static let ApiPort = 9000
        static let ApiPath = ""
    }
    
    struct Methods {
        static let QuestionsRequest = "/questions"
    }
    
    struct JSONResponseKeys {
        static let SuccessStatus = "success"
        static let SuccessMessage = "successMessage"
        static let ErrorMessage = "errorMessage"
        
        static let Questions = "questions"
    }
}
