//
//  InovaQuestion.swift
//  PSAChallenge
//
//  Created by Igor Clemente on 24/09/2018.
//  Copyright © 2018 Igor Clemente. All rights reserved.
//

import Foundation

struct InovaQuestion {
    
    let identifier: Int
    let question_text: String
    let question_response_text: String
    var alternatives: [InovaAlternativeQuestion] = [InovaAlternativeQuestion]()
    
    init?(_ dictionary: [String:Any]) {
        guard let questionIdentifier = dictionary[InovaClient.JSONResponseKeys.QuestionIdentifier] as? Int,
              let questionText = dictionary[InovaClient.JSONResponseKeys.QuestionText] as? String,
              let questionResponseText = dictionary[InovaClient.JSONResponseKeys.QuestionResponseText] as? String,
              let alternativesQuestions = dictionary[InovaClient.JSONResponseKeys.AlternativesQuestions] as? [[String:Any]] else {
            return nil
        }
        
        self.identifier = questionIdentifier
        self.question_text = questionText
        self.question_response_text = questionResponseText
        
        let alternativesQuestionsArray = InovaAlternativeQuestion.alternativesQuestionsFor(alternatives: alternativesQuestions)
        
        guard !alternativesQuestionsArray.isEmpty else { return nil }
        self.alternatives = alternativesQuestionsArray
    }
    
    static func questionsFor(question array: [[String:Any]]) -> [InovaQuestion] {
        var questionsArray: [InovaQuestion] = []
        array.forEach { (questionDictionary) in
            guard let questionObject = InovaQuestion(questionDictionary) else { return }
            questionsArray.append(questionObject)
        }
        return questionsArray
    }
}
