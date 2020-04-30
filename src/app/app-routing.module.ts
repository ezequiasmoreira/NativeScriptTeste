import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import { ImcComponent } from "./imc/imc-component";
import { UsuarioComponent } from "./usuario/usuario-component";
import { LoginComponent } from "./login/login-component";
import { PerfilComponent } from "./perfil/perfil-component";

/*Cria rotas para determinados componentes*/

const routes: Routes = [
    { path: "", redirectTo: "/imc", pathMatch: "full" },
    { path: "imc", component: ImcComponent },
    { path: "usuario", component: UsuarioComponent },
    { path: "login", component: LoginComponent },
    { path: "perfil", component: PerfilComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
