import { SocialUser } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { TokenResponse } from 'src/app/contracts/token/tokenResponse';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private httpClientService:HttpClientService, private toastrService:CustomToastrService) { }

  async login(usernameOrEmail:string,password:string, callBackFunction?: () => void): Promise<any>{
    const observable:Observable<any | TokenResponse> =  this.httpClientService.post<any | TokenResponse>({
      controller:"auth",
      action:"login"
    },{ usernameOrEmail, password })

    const tokenResponse: TokenResponse =  await firstValueFrom(observable);
    if(tokenResponse){
      localStorage.setItem("accessToken",tokenResponse.token.accessToken);


      this.toastrService.message("Kullanıcı girişi başarıyla sağlanmıştır","Giriş Başarılı",{
        messageType:ToastrMessageType.Success,
        position: ToastrPosition.TopRight
      })
    }
    else {
      this.toastrService.message("Kullanıcı adı veya şifre hatalı","Giriş Başarısız",{
        messageType:ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      })
    }
      
    callBackFunction();

  }

  async googleLogin(user: SocialUser, callBackFunction?: () => void) : Promise<any>{
      const observable:Observable<SocialUser | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
        action: "google-login",
        controller:"auth"
      }, user);

      const tokenResponse:TokenResponse = await firstValueFrom(observable) as TokenResponse;

      if(tokenResponse){

        localStorage.setItem("accessToken",tokenResponse.token.accessToken);

        this.toastrService.message("Google üzerinden giriş başarılı","Giriş başarılı",{
          messageType:ToastrMessageType.Success,
          position:ToastrPosition.TopRight
        });

        callBackFunction();
      }
    
  }

  async facebookLogin(user:SocialUser, callBackFunction?: () => void):Promise<any>{
    const observable:Observable<SocialUser | TokenResponse> = this.httpClientService.post<SocialUser | TokenResponse>({
      controller:"auth",
      action:"facebook-login"
    }, user);

    const tokenResponse:TokenResponse = await firstValueFrom(observable) as TokenResponse;

    if(tokenResponse){
      localStorage.setItem("accessToken",tokenResponse.token.accessToken);
      this.toastrService.message("Facebook üzerinden giriş başarılı","Giriş başarılı",{
        messageType:ToastrMessageType.Success,
        position:ToastrPosition.TopRight
      });
    }

    callBackFunction();

  }

}
