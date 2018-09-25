//
//  InovaConvenience.swift
//  PSAChallenge
//
//  Created by Igor Clemente on 24/09/2018.
//  Copyright © 2018 Igor Clemente. All rights reserved.
//

import Foundation

extension InovaClient {
    
    func requestAllQuestionsFor(_ completionHandlerForRequestAllQuestions: @escaping (_ success: Bool,
                                                                                      _ questions: [[String:Any]]?,
                                                                                      _ errorString: String?) -> Void) {
        taskForGETMethod(Methods.QuestionsRequest, [:]) { (results, error) in
            if let error = error {
                print(error.localizedDescription)
                completionHandlerForRequestAllQuestions(false,nil,error.localizedDescription)
            } else {
                if let results = results as? [String:Any],
                   let successFlag = results[JSONResponseKeys.SuccessStatus] as? Bool,
                   successFlag {
                    guard let questions = results[JSONResponseKeys.Questions] as? [[String:Any]] else {
                        let messageError = "Could not find key: \(JSONResponseKeys.Questions)"
                        completionHandlerForRequestAllQuestions(false,nil,messageError)
                        return
                    }
                    completionHandlerForRequestAllQuestions(true,questions,nil)
                } else {
                    if let results = results as? [String:Any],
                       let errorMessage = results[JSONResponseKeys.ErrorMessage] as? String {
                       completionHandlerForRequestAllQuestions(false,nil,errorMessage)
                    }
                    let messageError: String = "Could not find key: \(JSONResponseKeys.ErrorMessage)"
                    completionHandlerForRequestAllQuestions(false,nil,messageError)
                }
            }
        }
    }
}
