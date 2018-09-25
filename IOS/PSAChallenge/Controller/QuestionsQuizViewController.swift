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
    
    override func viewDidLoad() {
        super.viewDidLoad()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    @IBAction func tapRequestQuestions() -> Void {
        InovaClient.sharedInstance().requestAllQuestionsFor { (success, questions, errorString) in
            if success {
                print("QUESTIONS DEBUG", questions)
            }
        }
    }
}

