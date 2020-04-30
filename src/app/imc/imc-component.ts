import { Component,Injectable  } from "@angular/core";
import { FormBuilder, FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { getFile, getImage, getJSON, getString, request, HttpResponse } from "tns-core-modules/http";

//Template url informa qual vai ser o html que sera executado para este componente
@Component({
    selector: "imc",
    moduleId: module.id,
    templateUrl: "./imc-component.html"
})
@Injectable()
export class ImcComponent {
    public form: FormGroup;
    public submitted: boolean;
    public formErrors: Array<string>;

    public constructor(public http: HttpClient,private formBuilder: FormBuilder, private router: Router){
        this.setupForm();
        this.submitted = false;
        this.formErrors = null;
    }

    public calcular(){
      
        let peso = this.form.get('peso').value;
        let altura = this.form.get('altura').value;

        let imc = peso/(altura*altura);

        let classificacao: String = this.obterClassificacao(imc);
        var dialogs = require("tns-core-modules/ui/dialogs");
        dialogs.alert('IMC: '+imc.toFixed(2)+'\nClassificação: '+classificacao).then(function() {
            console.log("Dialog closed!");
        });
    }
    public obterClassificacao(imc:number){

      if (imc < 18.5){
        return "MAGREZA";
      }

      if (imc < 24.9){
        return "NORMAL";
      }

      if (imc < 29.9){
        return "SOBREPESO";
      }

      if (imc < 39.9){
        return "OBESIDADE";
      }

      return "OBESIDADE GRAVE";
    }
    // Atribui valor inicial 
    private setupForm(){
      this.form = this.formBuilder.group({
        peso: [null, [Validators.required]],
        altura: [null, Validators.required]
      });
    }
}