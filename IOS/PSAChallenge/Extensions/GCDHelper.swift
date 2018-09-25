//
//  UIViewController.swift
//  PSAChallenge
//
//  Created by Igor Clemente on 24/09/2018.
//  Copyright © 2018 Igor Clemente. All rights reserved.
//

import Foundation
import UIKit

func performUIMain(_ closure: @escaping ()->Void) {
    DispatchQueue.main.async {
        closure()
    }
}

