import { Component,Injectable  } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient,HttpHeaders } from "@angular/common/http";
import { request, HttpResponse } from "tns-core-modules/http";

import * as camera from "nativescript-camera";
import { requestPermissions } from "nativescript-camera";
const imageModule = require("tns-core-modules/ui/image");
import { Image } from "tns-core-modules/ui/image"; 
import {ImageSource, fromFile, fromResource, fromBase64} from "tns-core-modules/image-source";
import {Folder, path, knownFolders} from "tns-core-modules/file-system";

@Component({
    selector: "perfil",
    moduleId: module.id,
    templateUrl: "./perfil-component.html"
})
@Injectable()
export class PerfilComponent {
    public form: FormGroup;
    public submitted: boolean;
    public formErrors: Array<string>;

    public constructor(public http: HttpClient,private formBuilder: FormBuilder, private router: Router){
        this.setupForm();
        this.submitted = false;
        this.formErrors = null;
      }
      public tirarFoto(){
        const options = {
          width: 300,
          height: 300,
          keepAspectRatio: true,
          saveToGallery: true,
          allowsEditing: true
      };
        camera.requestPermissions().then(
          function success() {
            const source = new ImageSource();
              camera.takePicture(options)   
              .then(function (imageAsset) {
                const source = new ImageSource();

                source.fromAsset(imageAsset)
                    .then((imageSource: ImageSource) => {
                        const folderPath: string = knownFolders.documents().path;
                        const fileName: string = "test.jpg";
                        const filePath: string = path.join(folderPath, fileName);
                        const saved: boolean = imageSource.saveToFile(filePath, "jpg");
                
                        if (saved) {
                            console.log("Gallery: " + this._dataItem.picture_url);
                            console.log("Saved: " + filePath);
                            console.log("Image saved successfully!");
                        }
                    });
              }).catch(function (err) {
                  console.log("Error -> " + err.message);
              });
          }, 
          function failure() {
          }
        );        
      }
      public exibirMensagem(mensagem){        
        var dialogs = require("tns-core-modules/ui/dialogs");
        dialogs.alert(mensagem).then(function() {
            console.log("Dialog closed!");
        });
      }      
      ngOnInit() {
        const appSettings = require("tns-core-modules/application-settings");
        let email = appSettings.getString("email");
        let token = appSettings.getString("token");
        //Enviando o token no cabeçalho 
        request({       
            url: "http://10.0.3.3:8081/pessoas/email?value="+email,
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": 'Bearer ' + token,
        }

        }).then((response: HttpResponse) => {
          let usuario = JSON.parse(response.content.toString())
          const appSettings = require("tns-core-modules/application-settings");
          appSettings.setString("id",usuario.id+"")
          this.form = this.formBuilder.group({
            "nome": [usuario.nome, []],
            "cpf": [usuario.cpf, []],
            "rg": [usuario.rg, []],
            "email": [usuario.email, []]          
          });
        }, (e) => {     
            console.log(e);
        });
          
      }
      public alterarUsuario(){
        const appSettings = require("tns-core-modules/application-settings");
        appSettings.getString("id");

        let token = appSettings.getString("token");
        let nome = this.form.get('nome').value;
        let cpf = this.form.get('cpf').value;
        let rg = this.form.get('rg').value;
        let email = this.form.get('email').value;
        let senha = null;
        let id = appSettings.getString("id");;
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

        request({
            url: "http://10.0.3.3:8081/pessoas/"+id,
            method: "PUT",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": 'Bearer ' + token,
            },
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
        }).then((response) => {
            this.exibirMensagem('Salvo com sucesso');
            this.router.navigate(['/login']);
        }, (e) => {
            console.log(e);
      });
    }
    
    public excluirUsuario(){
      const appSettings = require("tns-core-modules/application-settings");
      let id = appSettings.getString("id");
      let token = appSettings.getString("token");

      request({
        url: "http://10.0.3.3:8081/pessoas/"+id,
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": 'Bearer ' + token
        }
        // Apos a remoção appSettings.setString ("") limpa a chave local
        }).then((response) => {
          this.exibirMensagem('Conta removida com sucesso');
          appSettings.setString("id","");
          appSettings.setString("email","");
          appSettings.setString("token","");
          this.router.navigate(['/imc']);
        }, (e) => {
          this.exibirMensagem('Não fooi possivel excluir');
      });
    }
    private setupForm(){
      this.form = this.formBuilder.group({
        nome: [null, [Validators.required, Validators.email]],
        cpf: [null, Validators.required],
        rg: [null, Validators.required],
        email: [null, Validators.required]
      });
    }
    
}