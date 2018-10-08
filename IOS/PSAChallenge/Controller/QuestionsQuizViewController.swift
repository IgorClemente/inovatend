//
//  ViewController.swift
//  PSAChallenge
//
//  Created by Igor Clemente on 23/08/2018.
//  Copyright © 2018 Igor Clemente. All rights reserved.
//

import UIKit
import ARKit

class QuestionsQuizViewController: UIViewController {

    @IBOutlet weak var questionCentralText: UILabel?
    @IBOutlet weak var questionCentralTextFrame: UIView?
    @IBOutlet weak var questionResponseProgressIndicator: UIProgressView?
    
    @IBOutlet var questionResponsesLabelArray: Array<UILabel>?
    @IBOutlet var questionResponsesButtonArray: Array<UIButton>?
    
    var questionsObjectsArray: Array<InovaQuestion>?
    var currentAlternativeQuestionObject: InovaAlternativeQuestion?
    var currentQuestionObject: InovaQuestion?
    
    var sceneView: ARSCNView? = nil
    var planes = [OverlayPlane]()
    var planeCurrentAnchor: ARPlaneAnchor? = nil
    
    var popUpPresentCounterTimer: Timer? = nil
    var popUpPresentActive: Bool = false
    
    var questionResponseCurrentProgress: Float? = nil
    var questionResponseCurrentIndex: Int? = nil
    var questionCount: Int? = nil
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        self.setupUIStatus(true,nil)
        
        guard let sceneView = self.sceneView else { return }
        let configuration = ARWorldTrackingConfiguration()
        configuration.planeDetection = .horizontal
        
        sceneView.session.run(configuration)
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.requestQuestionsFromServer()
        self.setupUIStatus(true,nil)
        
        guard let progressBar = self.questionResponseProgressIndicator else { return }
        progressBar.progress = 0.0
    }

    override func viewDidDisappear(_ animated: Bool) {
        super.viewDidDisappear(animated)
        
        guard let sceneView  = self.sceneView else { return }
        sceneView.session.pause()
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
    }
    
    private func setupSceneView() -> Void {
        self.sceneView = ARSCNView(frame: self.view.frame)
        self.sceneView?.delegate = self
        self.sceneView?.automaticallyUpdatesLighting = true
        self.sceneView?.autoenablesDefaultLighting = true
        self.sceneView?.debugOptions = [ARSCNDebugOptions.showFeaturePoints]
        
        let scene = SCNScene()
        self.sceneView?.scene = scene
        
        guard let sceneView = self.sceneView else { return }
        self.view.addSubview(sceneView)
        
        let configuration = ARWorldTrackingConfiguration()
        configuration.planeDetection = .horizontal
        sceneView.session.run(configuration)
        
        self.setupGestureRecognizer()
    }
    
    private func setupCarScene(_ hitResult: ARHitTestResult) -> Void {
        guard let carScene = SCNScene(named: "audi-r8-red.dae") else { return }
        
        let carNode = SCNNode()
        let carSceneChildNodes = carScene.rootNode.childNodes
        
        for childNode in carSceneChildNodes {
            carNode.addChildNode(childNode)
        }
        
        carNode.position = SCNVector3Make(hitResult.worldTransform.columns.3.x, hitResult.worldTransform.columns.3.y,
                                          hitResult.worldTransform.columns.3.z)
        
        guard let currentLastPlane = self.planes.last else { return }
        
        carNode.scale = SCNVector3(currentLastPlane.anchor.extent.x, currentLastPlane.anchor.extent.x,
                                   currentLastPlane.anchor.extent.x)
        
        guard let sceneView = self.sceneView else { return }
        sceneView.scene.rootNode.addChildNode(carNode)
    }
    
    private func verifyQuestionResponse(question identifier: Int,_ responseIdentifier: Int,
                                        _ completionHandlerForVerifyQuestion: @escaping (_ success: Bool) -> Void) -> Void {
        InovaClient.sharedInstance().setResponseFor(question: identifier, and: responseIdentifier) {
            (success, response, errorString) in
            completionHandlerForVerifyQuestion(success)
        }
    }
    
    private func requestQuestionsFromServer() -> Void {
        InovaClient.sharedInstance().requestAllQuestionsFor { (success, questions, errorString) in
            if success {
                guard let questionsDictionary = questions else { return }
                
                let questionsArrayObjects = InovaQuestion.questionsFor(question: questionsDictionary)
                self.questionsObjectsArray = questionsArrayObjects
                self.questionCount = self.questionsObjectsArray?.count
                self.setupInformationFromQuestionsUI()
            }
        }
    }
    
    private func setupInformationFromQuestionsUI() -> Void {
        guard let centralQuestionTextLabel = self.questionCentralText,
              var questionsObjectsArray = self.questionsObjectsArray else { return }
        
        guard let progressBar = self.questionResponseProgressIndicator else { return }
        
        if questionsObjectsArray.isEmpty {
            performUIMain {
                self.setupSceneView()
                print("Todas as questões respondidas!")
            }
            return
        }
        
        let randomQuestionIdentifier = arc4random_uniform(UInt32(questionsObjectsArray.count))
        let randomQuestion = questionsObjectsArray[Int(randomQuestionIdentifier)]
        
        self.currentQuestionObject = randomQuestion
        self.questionsObjectsArray?.remove(at: Int(randomQuestionIdentifier))
        
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
            guard let questionResponsesArray = self.questionResponsesLabelArray else { return }
            
            let alternativeQuestionLabel = questionResponsesArray[index]
            
            performUIMain {
                alternativeQuestionLabel.text = alternative.alternativeQuestionText
            }
        }
        
        guard let questionCount = self.questionCount else { return }
        performUIMain {
            progressBar.progress = Float((Double(-questionsObjectsArray.count) * 1.0) / Double(questionCount)) + 1.0
        }
    }
    
    private func setupUIStatus(_ enabled: Bool, _ completion: (() -> Void)?) -> Void {
        guard let questionResponsesButtonArray = self.questionResponsesButtonArray,
              let questionResponsesLabelArray = self.questionResponsesLabelArray else { return }
        
        guard let completionHandler = completion else { return }
        
        if enabled {
            performUIMain {
                questionResponsesButtonArray.enumerated().forEach { (index,button) in
                    button.isEnabled = enabled
                    let responseLabelElement = questionResponsesLabelArray[index]
                    responseLabelElement.alpha = 1.0
                }
                completionHandler()
            }
            return
        }
        
        performUIMain {
            questionResponsesButtonArray.enumerated().forEach { (index,button) in
                button.isEnabled = enabled
                let responseLabelElement = questionResponsesLabelArray[index]
                responseLabelElement.alpha = 0.5
            }
            completionHandler()
        }
    }
    
    @IBAction func tapAlternativeQuestionSelected(_ button: UIButton) -> Void {
        self.setupUIStatus(false,nil)
        
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
            self.setupUIStatus(true,nil)
            return
        }
        
        var questionsSorted = currentQuestionObject.alternatives.sorted { (alternativeA, alternativeB) -> Bool in
            return alternativeA.identifier < alternativeB.identifier
        }
        
        guard !questionsSorted.isEmpty else {
            self.setupUIStatus(true,nil)
            return
        }
        
        guard questionsSorted.enumerated().contains(where: { (index,alternativeQuestion) -> Bool in
            return index == alternativeQuestionArrayIndex
        }) else { return }
        
        currentAlternativeQuestionObject = questionsSorted[alternativeQuestionArrayIndex]
        
        guard let currentAlternativeQuestion = self.currentAlternativeQuestionObject else { return }
        
        let currentQuestionIdentifier: Int = currentQuestionObject.identifier
        let currentQuestionResponseIdentifier: Int = currentAlternativeQuestion.identifier
        
        self.verifyQuestionResponse(question: currentQuestionIdentifier, currentQuestionResponseIdentifier) { (success) in
            guard let questionsObjectsArray = self.questionsObjectsArray else { return }

            if questionsObjectsArray.isEmpty {
                performUIMain {
                    self.setupSceneView()
                }
                print("Todas as questões respondidas!")
                return
            }

            self.setupInformationFromQuestionsUI()
            self.setupUIStatus(true,nil)
        }
    }
}

extension QuestionsQuizViewController : ARSCNViewDelegate {

    private func setupGestureRecognizer() -> Void {
        let gestureRecognizer = UITapGestureRecognizer(target: self, action: #selector(tapped))
        self.sceneView?.addGestureRecognizer(gestureRecognizer)
    }
    
    private func updateProgressBar(_ status: Bool) -> Void {
        guard let progressBar = self.questionResponseProgressIndicator else { return }
        
        if status {
            performUIMain {
                progressBar.progress = 0.2
            }
        }
    }
    
    func renderer(_ renderer: SCNSceneRenderer, didAdd node: SCNNode, for anchor: ARAnchor) {
        guard let anchor = anchor as? ARPlaneAnchor else { return }
        
        let plane = OverlayPlane(anchor)
        self.planes.append(plane)
        
        node.addChildNode(plane)
    }
    
    func renderer(_ renderer: SCNSceneRenderer, didUpdate node: SCNNode, for anchor: ARAnchor) {
        guard let anchor = anchor as? ARPlaneAnchor else { return }
        
        let plane = self.planes.filter { (plane) in
            return plane.anchor.identifier == anchor.identifier
        }.first
        
        if plane == nil {
            return
        }
        plane?.update(anchor: anchor)
    }
    
    @objc private func tapped(gesture: UITapGestureRecognizer) -> Void {
        let tappedView = gesture.view as! ARSCNView
        let tappedLocation = gesture.location(in: tappedView)
        let hitResults = self.sceneView?.hitTest(tappedLocation, types: .existingPlaneUsingExtent)
        
        if !(hitResults?.isEmpty)! {
            guard let hitFirst = hitResults?.first else { return }
            self.setupCarScene(hitFirst)
        }
    }
}

