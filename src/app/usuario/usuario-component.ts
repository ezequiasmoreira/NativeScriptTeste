import { Component,Injectable  } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { getFile, getImage, getJSON, getString, request, HttpResponse } from "tns-core-modules/http";

@Component({
    selector: "usuario",
    moduleId: module.id,
    templateUrl: "./usuario-component.html"
})
@Injectable()
export class UsuarioComponent {
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
      
      public cadastrarUsuario(){
        let nome = this.form.get('nome').value;
        let cpf = this.form.get('cpf').value;
        let rg = this.form.get('rg').value;
        let email = this.form.get('email').value;
        let senha = this.form.get('senha').value;
        let id = 1;
        let codigo = 1;
        let logradouro = 'PADRÃO';
        let numero = 1;
        let complemento = 'PADRÃO';
        let bairro = 'PADRÃO';
        let cep = 'PADRÃO';
        let cidadeId = 1;
        let telefone = '00000000';
        let perfil = '1';
        let sexo = '1';
      // method: "POST" >> Cadastro de usuario 
      request({
          // 10.0.3.3 >> local host exigido pelo emulador genymotion
          url: "http://10.0.3.3:8081/pessoas",
          //url: "https://httpbin.org/post",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          content: JSON.stringify({
            id: id,
            nome: nome,
            cpf : cpf,
            rg : rg,
            email : email,
            senha : senha,
            codigo : codigo,
            logradouro : logradouro,
            numero : numero,
            complemento : complemento,
            bairro : bairro,
            cep : cep,
            cidadeId : cidadeId,
            telefone : telefone,
            perfil : perfil,
            sexo : sexo

          })
      // response >> retorno de sucesso, retorno apos post
      }).then((response) => {
          this.exibirMensagem('Salvo com sucesso');
          // navigate >> navega entres as paginas
          this.router.navigate(['/login']);
      }, (e) => {
          // >> (hide)
          this.exibirMensagem('ERRO: Não foi possível salvar');
          console.log(e);
          // << (hide)
      });
    }
    
    private setupForm(){
      this.form = this.formBuilder.group({
        nome: [null, [Validators.required, Validators.email]],
        cpf: [null, Validators.required],
        rg: [null, Validators.required],
        email: [null, Validators.required],
        senha: [null, Validators.required]
      });
    }
    
}