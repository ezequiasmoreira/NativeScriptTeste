import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs'; 

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        console.log("passou no interceptor");
        const appSettings = require("tns-core-modules/application-settings");
        let localUser = appSettings.getString("email");
        let token = appSettings.getString("token");
        console.log("passou no interceptor");
        let N = "http://localhost:8081".length;
        let requestToAPI = req.url.substring(0, N) =="http://localhost:8081";

        if (localUser && requestToAPI) {
            const authReq = req.clone({headers: req.headers.set('Authorization', 'Bearer ' + token)});
            return next.handle(authReq);
        }
        else {
            return next.handle(req);
        }
    }
}

export const AuthInterceptorProvider = {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true,
};