//
//  ViewController.swift
//  PSAChallenge
//
//  Created by Igor Clemente on 23/08/2018.
//  Copyright © 2018 Igor Clemente. All rights reserved.
//

import UIKit

class QuestionsQuizViewController: UIViewController {

    @IBOutlet weak var questionCentralText: UILabel?
    @IBOutlet var questionResponsesArray: Array<UILabel>?
    
    var questionsObjectsArray: Array<InovaQuestion>?
    var currentAlternativeQuestionObject: InovaAlternativeQuestion?
    var currentQuestionObject: InovaQuestion?
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.requestQuestionsFromServer()
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.requestQuestionsFromServer()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    private func verifyQuestionResponse(question identifier: Int,_ responseIdentifier: Int) -> Void {
        InovaClient.sharedInstance().setResponseFor(question: identifier, and: responseIdentifier) { (success, response, errorString) in
            if success {
                print("Resposta Correta!")
                return
            }
            print(errorString)
        }
    }
    
    private func requestQuestionsFromServer() -> Void {
        InovaClient.sharedInstance().requestAllQuestionsFor { (success, questions, errorString) in
            if success {
                guard let questionsDictionary = questions else { return }
                let questionsArrayObjects = InovaQuestion.questionsFor(question: questionsDictionary)
                
                self.questionsObjectsArray = questionsArrayObjects
                self.setupInformationFromQuestionsUI()
            }
        }
    }
    
    private func setupInformationFromQuestionsUI() -> Void {
        guard let questionCentralTextLabel = self.questionCentralText,
              let questionsObjectsArray = self.questionsObjectsArray else { return }
        
        let randomQuestionIdentifier = arc4random_uniform(UInt32(questionsObjectsArray.count))
        let randomQuestion = questionsObjectsArray[Int(randomQuestionIdentifier)]
        
        self.currentQuestionObject = randomQuestion

        performUIMain {
            questionCentralTextLabel.alpha = 0.0
            questionCentralTextLabel.isHidden = true
            
            UIView.animate(withDuration: 0.7, animations: {
                questionCentralTextLabel.alpha = 1.0
            }, completion: { (_) in
                questionCentralTextLabel.isHidden = false
                questionCentralTextLabel.text = "\(randomQuestion.question_text)"
            })
        }
        
        let questionsSorted = randomQuestion.alternatives.sorted { (questionA, questionB) -> Bool in
            return questionA.identifier < questionB.identifier
        }
        
        for (index,alternative) in questionsSorted.enumerated() {
            guard let questionResponsesArray = self.questionResponsesArray else { return }
            let alternativeQuestionLabel = questionResponsesArray[index]
            
            performUIMain {
                alternativeQuestionLabel.text = alternative.alternativeQuestionText
            }
        }
    }
    
    @IBAction func tapAlternativeQuestionSelected(_ button: UIButton) -> Void {
        guard let questionIdentifier = button.restorationIdentifier,
              let currentQuestionObject = self.currentQuestionObject else { return }
        
        let questionsSorted = currentQuestionObject.alternatives.sorted { (alternativeA, alternativeB) -> Bool in
            return alternativeA.identifier < alternativeB.identifier
        }
        
        guard let alternativeQuestionArrayIndex = Int(questionIdentifier) else { return }
        let alternativeSelected = questionsSorted[alternativeQuestionArrayIndex - 1]
        
        currentAlternativeQuestionObject = alternativeSelected
        
        let currentQuestionIdentifier: Int = currentQuestionObject.identifier
        print(currentQuestionObject)
        self.verifyQuestionResponse(question: currentQuestionIdentifier, currentQuestionObject.question_response_identifier)
        self.setupInformationFromQuestionsUI()
    }
}

