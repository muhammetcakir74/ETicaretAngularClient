import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { FileUploadDialogComponent, FileUploadDialogState } from 'src/app/dialogs/file-upload-dialog/file-upload-dialog.component';
import { AlertifyService, MessageType, Position } from '../../admin/alertify.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { DialogService } from '../dialog.service';
import { HttpClientService } from '../http-client.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent {

  constructor(
    private httpClientService:HttpClientService,
    private aletify:AlertifyService,
    private customToastrService:CustomToastrService,
    private dialogService:DialogService,
    private spinner:NgxSpinnerService
    ) {}

  public files: NgxFileDropEntry[];

  @Input() options: Partial<FileUploadOptions>;

  // openDialog(afterClosed:any): void {
  //   const dialogRef = this.dialog.open(FileUploadDialogComponent, {
  //     width: '250px',
  //     data: FileUploadDialogState.Yes,
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if(result == FileUploadDialogState.Yes){
  //       afterClosed();
  //     }
  //   });
  // }

  public selectedFiles(files: NgxFileDropEntry[]) {
    this.files = files;
    const fileData: FormData = new FormData();
    for (const file of files) {
      (file.fileEntry as FileSystemFileEntry).file((_file:File) =>{
        fileData.append(_file.name,_file, file.relativePath);
      });
    }
    this.dialogService.openDialog({
      componentType: FileUploadDialogComponent,
      data: FileUploadDialogState.Yes,
      afterClosed: () => {
        this.spinner.show(SpinnerType.LineScale);
        this.httpClientService.post({
          controller:this.options.controller,
          action:this.options.action,
          queryString:this.options.queryString,
          headers:new HttpHeaders({"responseType": "blob"})
        },fileData).subscribe(data => {
    
          const message: string = "Dosyalar başarıyla yüklenmiştir"
          this.spinner.hide(SpinnerType.LineScale);
          if(this.options.isAdminPage) {
            this.aletify.message(message,{
              dismissOthers: true,
              messageType: MessageType.Success,
              position: Position.TopRight
            })
          } else {
            this.customToastrService.message(message,"Başarılı.",{
              messageType:ToastrMessageType.Success,
              position:ToastrPosition.TopRight
            })
          }
          
    
        }, (errorResponse:HttpErrorResponse) => {
          const message: string = "Dosyalar yüklenirken beklenmeyen bir hatayla karşılaşılmıştır."
          this.spinner.hide(SpinnerType.LineScale);
          if(this.options.isAdminPage) {
            this.aletify.message(message,{
              dismissOthers: true,
              messageType: MessageType.Error,
              position: Position.TopRight
            })
          } else {
            this.customToastrService.message(message,"Başarısız.",{
              messageType:ToastrMessageType.Error,
              position:ToastrPosition.TopRight
            })
          }
        });
  
      }
    });
    
    


  }

}

export class FileUploadOptions {
  controller?:string;
  action?:string;
  queryString?:string;
  explanation?:string;
  accept?:string;
  isAdminPage?: boolean = false;
}


