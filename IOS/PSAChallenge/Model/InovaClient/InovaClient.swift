//
//  InovaClient.swift
//  PSAChallenge
//
//  Created by Igor Clemente on 24/09/2018.
//  Copyright © 2018 Igor Clemente. All rights reserved.
//

import Foundation
import UIKit

class InovaClient : NSObject {
    
    let session = URLSession.shared
    
    func taskForGETMethod(_ method: String,_ parameters: [String:Any],
                          _ completionHandlerForGET: @escaping (_ result: Any?,_ error: NSError?) -> Void) {
        
        self.spinnerNetworkStatus(true)
        
        guard let url = inovaMakeURLFromParameters(parameters,withPathExtension: method) else {
            let userInfo = [NSLocalizedDescriptionKey : "Error create URL"]
            completionHandlerForGET(nil,NSError(domain: "taskForGETMethod", code: 1, userInfo: userInfo))
            return
        }
        
        let request = URLRequest(url: url)
        
        let task = session.dataTask(with: request) { (data, response, error) in
            
            self.spinnerNetworkStatus(false)
            
            func sendError(_ error: String) {
                print(error)
                let userInfo = [NSLocalizedDescriptionKey: error]
                completionHandlerForGET(nil, NSError(domain: "taskForGETMethod", code: 1, userInfo: userInfo))
            }
            
            guard (error == nil) else {
                sendError("There was when error with your request \(!(error != nil))")
                return
            }
            
            guard let statusCode = (response as? HTTPURLResponse)?.statusCode,
                statusCode >= 200 && statusCode <= 299 else {
                    sendError("Your request returned a status code other than 2xx!")
                    return
            }
            
            guard let data = data else {
                sendError("No data was returned by the request!")
                return
            }
            
            self.convertDataWithCompletionHandler(data, completionHandlerForConvertData: completionHandlerForGET)
        }
        task.resume()
    }
    
    func taskForPOSTMethod(_ method: String, parameters: [String:Any], jsonBody: String?,
                           completionHandlerForPOST: @escaping (_ result: Any?,_ error: NSError?) -> Void) {
        
        self.spinnerNetworkStatus(true)
        
        var parametersWithImageData = parameters
        
        guard let urlString = inovaMakeURLFromParameters(parameters, withPathExtension: method) else {
            return
        }
        
        print("URL STR",urlString)
        print("JSON BODY",jsonBody)
        print("BODY", jsonBody?.data(using: .utf8))
        
        var request = URLRequest(url: urlString)
        request.httpMethod = "POST"
        
        if let jsonBody = jsonBody {
            request.httpBody = jsonBody.data(using: .utf8)
        }
        
        let task = session.dataTask(with: request) { (data, response, error) in
            
            self.spinnerNetworkStatus(false)
            
            func sendError(_ error: String) {
                print(error)
                let userInfo = [NSLocalizedDescriptionKey : error]
                completionHandlerForPOST(nil, NSError(domain: "taskForGETMethod", code: 1, userInfo: userInfo))
            }
            
            guard (error == nil) else {
                sendError("There was an error with your request: \(error!)")
                return
            }
            
            guard let statusCode = (response as? HTTPURLResponse)?.statusCode, statusCode >= 200 && statusCode <= 299 else {
                sendError("Your request returned a status code other than 2xx!")
                return
            }
            
            guard let data = data else {
                sendError("No data was returned by the request!")
                return
            }
            self.convertDataWithCompletionHandler(data, completionHandlerForConvertData: completionHandlerForPOST)
        }
        task.resume()
    }
    
    private func convertDataWithCompletionHandler(_ data: Data,
                                                  completionHandlerForConvertData: (_ result: Any?,
                                                                                    _ error: NSError?) -> Void) {
        var parsedResult: Any? = nil
        do {
            parsedResult = try JSONSerialization.jsonObject(with: data, options: .allowFragments) as Any
        } catch {
            let userInfo = [NSLocalizedDescriptionKey : "Could not parse the data as JSON: '\(data)'"]
            let error = NSError(domain: "convertDataWithCompletionHandler", code: 1, userInfo: userInfo)
            completionHandlerForConvertData(nil,error)
        }
        completionHandlerForConvertData(parsedResult,nil)
    }
    
    private func spinnerNetworkStatus(_ actived: Bool) {
        performUIMain {
            UIApplication.shared.isNetworkActivityIndicatorVisible = actived
        }
    }
    
    func substituteKeyInMethod(_ method: String, key: String, value: String) -> String? {
        if method.range(of: "{\(key)}") != nil {
            return method.replacingOccurrences(of: "{\(key)}", with: value)
        } else {
            return nil
        }
    }
    
    func inovaMakeURLFromParameters(_ parameters: [String:Any],withPathExtension: String? = nil) -> URL? {
        var components = URLComponents()
        components.scheme = Constants.ApiScheme
        components.host = Constants.ApiHost
        components.port = Constants.ApiPort
        components.path = Constants.ApiPath + (withPathExtension ?? "")
        components.queryItems = [URLQueryItem]()
        
        for (key,value) in parameters {
            let queryItem = URLQueryItem(name: key, value: "\(value)")
            components.queryItems?.append(queryItem)
        }
        return components.url
    }
    
    class func sharedInstance() -> InovaClient {
        struct Singleton {
            static let sharedInstance = InovaClient()
        }
        return Singleton.sharedInstance
    }
}
