//
//  Rounder.swift
//  PSAChallenge
//
//  Created by MACBOOK AIR on 24/09/2018.
//  Copyright © 2018 Igor Clemente. All rights reserved.
//

import Foundation
import UIKit

@IBDesignable
class Rounder : UIView {
    
    @IBInspectable var raddii: CGFloat = 10.0
    
    @IBOutlet var cornerViews: [UIView]? {
        didSet {
            guard let allViews = cornerViews else { return }
            allViews.forEach { (view) in
                view.layer.cornerRadius = raddii
            }
        }
    }
}
