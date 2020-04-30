import { Component,Injectable  } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { getFile, getImage, getJSON, getString, request, HttpResponse } from "tns-core-modules/http";

@Component({
    selector: "login",
    moduleId: module.id,
    templateUrl: "./login-component.html"
})
@Injectable()
export class LoginComponent {
    public form: FormGroup;
    public submitted: boolean;
    public formErrors: Array<string>;

    public constructor(public http: HttpClient,private formBuilder: FormBuilder, private router: Router){      
        this.setupForm();
        this.submitted = false;
        this.formErrors = null;
      }

      public exibirMensagem(mensagem){        
        var dialogs = require("tns-core-modules/ui/dialogs");
        dialogs.alert(mensagem).then(function() {
            console.log("Dialog closed!");
        });
      }

    public logar(){
      
        let email = this.form.get('email').value;
        let senha = this.form.get('senha').value;
        
        request({
          url: "http://10.0.3.3:8081/login",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          content: JSON.stringify({
            email : email,
            senha : senha
          })
          }).then((response) => { 
            // url padrão para salvar local via javaScript no NativeScript
            const appSettings = require("tns-core-modules/application-settings");
            // appSettings.setString >> Salva os dados local, neste caso o email salvo na chave email
            appSettings.setString("email", email);
            // o token é retornado no cabeçalho da requisição 
            let aut = response.headers.Authorization
            let tok = aut.slice(7,aut.length);

            console.log(response.headers.Authorization) 
            console.log(tok) 
            appSettings.setString("token", tok);
            this.router.navigate(['/perfil']);
                    
          }, (e) => {
              this.exibirMensagem('ERRO: Não foi possível fazer login');
              console.log(e);
          });
        }
    
    private setupForm(){
      this.form = this.formBuilder.group({
        email: [null, [Validators.required, Validators.email]],
        senha: [null, Validators.required]
      });
    }
    
}