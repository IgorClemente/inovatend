//
//  InovaAlternativeQuestion.swift
//  PSAChallenge
//
//  Created by Igor Clemente on 24/09/2018.
//  Copyright © 2018 Igor Clemente. All rights reserved.
//

import Foundation

struct InovaAlternativeQuestion {
    
    let identifier: Int
    let alternativeQuestionText: String
    
    init?(_ dictionary: [String:Any]) {
        guard let alternativeQuestionIdentifier = dictionary[InovaClient.JSONResponseKeys.AlternativeQuestionIdentifier] as? Int,
            let alternativeQuestionText = dictionary[InovaClient.JSONResponseKeys.AlternativeQuestionText] as? String else {
            return nil
        }
        self.identifier = alternativeQuestionIdentifier
        self.alternativeQuestionText = alternativeQuestionText
    }
    
    static func alternativesQuestionsFor(alternatives array: [[String:Any]]) -> [InovaAlternativeQuestion] {
        var alternativesQuestionsObjectArray = [InovaAlternativeQuestion]()
        array.forEach { (alternativeQuestionDictionary) in
            guard let alternativeQuestionObject = InovaAlternativeQuestion(alternativeQuestionDictionary) else { return }
            alternativesQuestionsObjectArray.append(alternativeQuestionObject)
        }
        return alternativesQuestionsObjectArray
    }
}
