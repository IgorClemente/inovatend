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
    @IBOutlet var questionResponsesLabelArray: Array<UILabel>?
    @IBOutlet var questionResponsesButtonArray: Array<UIButton>?
    
    var questionsObjectsArray: Array<InovaQuestion>?
    var currentAlternativeQuestionObject: InovaAlternativeQuestion?
    var currentQuestionObject: InovaQuestion?
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.requestQuestionsFromServer()
        self.setupUIStatus(true)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.requestQuestionsFromServer()
        self.setupUIStatus(true)
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    private func verifyQuestionResponse(question identifier: Int,_ responseIdentifier: Int,
                                        _ completionHandlerForVerifyQuestion: @escaping (_ success: Bool,
                                                                                         _ response: String?) -> Void) -> Void {
        InovaClient.sharedInstance().setResponseFor(question: identifier, and: responseIdentifier) { (success, response, errorString) in
            if success {
                completionHandlerForVerifyQuestion(true,"Resposta correta!")
                return
            }
            completionHandlerForVerifyQuestion(false,"Resposta incorreta!")
        }
    }
    
    private func requestQuestionsFromServer() -> Void {
        InovaClient.sharedInstance().requestAllQuestionsFor { (success, questions, errorString) in
            if success {
                guard let questionsDictionary = questions else { return }
                let questionsArrayObjects = InovaQuestion.questionsFor(question: questionsDictionary)
                
                self.questionsObjectsArray = questionsArrayObjects
                self.setupInformationFromQuestionsUI { _ in
                    print("Change information profile.")
                }
            }
        }
    }
    
    private func setupInformationFromQuestionsUI(_ completionHandler: @escaping (_ success: Bool)->Void) -> Void {
        guard let centralQuestionTextLabel = self.questionCentralText else { return }
        
        guard let questionsObjectsArray = self.questionsObjectsArray else {
            completionHandler(false)
            return
        }
        
        let randomQuestionIdentifier = arc4random_uniform(UInt32(questionsObjectsArray.count))
        let randomQuestion = questionsObjectsArray[Int(randomQuestionIdentifier)]
        
        self.currentQuestionObject = randomQuestion
        
        performUIMain {
            centralQuestionTextLabel.alpha = 0.0
            centralQuestionTextLabel.isHidden = true
            
            UIView.animate(withDuration: 0.5, animations: {
                centralQuestionTextLabel.alpha = 1.0
            }, completion: { (_) in
                centralQuestionTextLabel.isHidden = false
                centralQuestionTextLabel.text = "\(randomQuestion.question_text)"
            })
        }
        
        let questionsSorted = randomQuestion.alternatives.sorted { (questionA, questionB) -> Bool in
            return questionA.identifier < questionB.identifier
        }
        
        for (index,alternative) in questionsSorted.enumerated() {
            guard let questionResponsesArray = self.questionResponsesLabelArray else {
                completionHandler(false)
                return
            }
            
            let alternativeQuestionLabel = questionResponsesArray[index]
            
            performUIMain {
                alternativeQuestionLabel.text = alternative.alternativeQuestionText
                completionHandler(true)
            }
        }
    }
    
    private func setupUIStatus(_ enabled: Bool) -> Void {
        guard let questionResponsesButtonArray = self.questionResponsesButtonArray,
              let questionResponsesLabelArray = self.questionResponsesLabelArray else { return }
        
        if enabled {
            questionResponsesButtonArray.enumerated().forEach { (index,button) in
                button.isEnabled = enabled
                let responseLabelElement = questionResponsesLabelArray[index]
                responseLabelElement.alpha = 1.0
            }
            return
        }
        
        questionResponsesButtonArray.enumerated().forEach { (index,button) in
            button.isEnabled = enabled
            let responseLabelElement = questionResponsesLabelArray[index]
            responseLabelElement.alpha = 0.5
        }
    }
    
    private func setupUIButtonStatus(_ button: UIButton,_ status: Bool) -> Void {
        guard let responseDefaultImage: UIImage = UIImage(named: "checked") else { return }
        
        let responseDefaultImageView = UIImageView(image: responseDefaultImage)
        responseDefaultImageView.frame = CGRect(x: 15,y: (button.frame.size.height / 2) - 25,width: 50, height: 50)
        responseDefaultImageView.restorationIdentifier = "checked"
        
        guard let superViewForButton = button.superview else { return }
        
        let responseDefaultColor: UIColor = UIColor(red: 0.800, green: 0.981, blue: 0.899, alpha: 1.0)
        
        if status {
           button.backgroundColor = responseDefaultColor
           superViewForButton.addSubview(responseDefaultImageView)
           return
        }
        button.backgroundColor = UIColor.red
    }
    
    @IBAction func tapAlternativeQuestionSelected(_ button: UIButton) -> Void {
        self.setupUIStatus(false)
        
        guard let questionResponsesButtonArray = self.questionResponsesButtonArray else { return }
        
        questionResponsesButtonArray.forEach { (button) in
            button.backgroundColor = UIColor.lightGray
            
            guard let buttonSuperView = button.superview else { return }
            let _ = buttonSuperView.subviews.map { view in
                guard let imageView = view as? UIImageView else { return }
                if imageView.restorationIdentifier == "checked" {
                    return imageView.image = nil
                }
            }
        }
        
        guard let questionIdentifier = button.restorationIdentifier,
              let currentQuestionObject = self.currentQuestionObject,
              let alternativeQuestionArrayIndex = Int(questionIdentifier) else {
            self.setupUIStatus(true)
            return
        }
        
        var questionsSorted = currentQuestionObject.alternatives.sorted { (alternativeA, alternativeB) -> Bool in
            return alternativeA.identifier < alternativeB.identifier
        }
        
        guard !questionsSorted.isEmpty else {
            self.setupUIStatus(true)
            return
        }
        
        guard questionsSorted.enumerated().contains(where: { (index,alternativeQuestion) -> Bool in
            return index == alternativeQuestionArrayIndex
        }) else { return }
        
        currentAlternativeQuestionObject = questionsSorted[alternativeQuestionArrayIndex]
        
        let currentQuestionIdentifier: Int = currentQuestionObject.identifier
        let currentQuestionResponseIdentifier: Int = currentQuestionObject.question_response_identifier
        
        self.verifyQuestionResponse(question: currentQuestionIdentifier, currentQuestionResponseIdentifier) {
            (success, response) in
            if success {
                guard let response = response else { return }
                print("DEBUG RESPONSE",response)
                performUIMain {
                    self.setupUIStatus(true)
                    self.setupUIButtonStatus(button,true)
                    self.setupInformationFromQuestionsUI({ (success) in
                        if success {
                            print("Interface Atualizada!")
                        }
                    })
                }
                return
            }
            
            guard let response = response else { return }
            print("DEBUG RESPONSE",response)
            performUIMain {
                self.setupUIStatus(true)
                self.setupUIButtonStatus(button,false)
                self.setupInformationFromQuestionsUI({ (success) in
                    if success {
                        print("Interface Atualizada!")
                    }
                })
            }
        }
    }
}

