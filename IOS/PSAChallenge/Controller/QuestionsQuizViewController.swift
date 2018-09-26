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
        guard let questionCentralTextLabel = self.questionCentralText else { return }
        
        let randomQuestionIdentifier = arc4random_uniform(UInt32((self.questionsObjectsArray?.count)!))
        let randomQuestion = self.questionsObjectsArray![Int(randomQuestionIdentifier)]
        
        performUIMain {
            questionCentralTextLabel.text = "\(randomQuestion.question_text)"
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
        print(button.restorationIdentifier)
    }
}

