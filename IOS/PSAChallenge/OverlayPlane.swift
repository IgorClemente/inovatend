//
//  OverlayPlane.swift
//  PSAChallenge
//
//  Created by Igor Clemente on 03/10/2018.
//  Copyright © 2018 Igor Clemente. All rights reserved.
//

import Foundation
import ARKit

class OverlayPlane : SCNNode {
    
    var anchor : ARPlaneAnchor
    var planeGeometry : SCNPlane!
    
    init(_ anchor: ARPlaneAnchor) {
        self.anchor = anchor
        super.init()
        self.setup()
    }
    
    func update(anchor: ARPlaneAnchor) {
        self.planeGeometry.width = CGFloat(anchor.extent.x)
        self.planeGeometry.height = CGFloat(anchor.extent.z)
        self.position = SCNVector3Make(anchor.center.x, 0, anchor.center.z)
    }
    
    func setup() {
        self.planeGeometry = SCNPlane(width: CGFloat(self.anchor.extent.x),
                                      height: CGFloat(self.anchor.extent.z))
        
        let planeMaterial = SCNMaterial()
        planeMaterial.diffuse.contents = UIImage(named: "overlay_grid.png")
        
        self.planeGeometry.materials = [planeMaterial]
        
        let planeNode = SCNNode(geometry: self.planeGeometry)
        planeNode.position = SCNVector3Make(self.anchor.center.x, 0, self.anchor.center.z)
        planeNode.transform = SCNMatrix4MakeRotation(Float(-Double.pi / 2.0), 1.0, 0.0, 0.0)
        self.addChildNode(planeNode)
    }
    
    required init?(coder aDecoder: NSCoder) {
        fatalError("Fatal Error")
    }
}

