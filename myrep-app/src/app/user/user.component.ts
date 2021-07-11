import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProfileData, ProfiledataService } from '../profiledata.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment as env } from '../../environments/environment';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  commentForm: FormGroup;
  public targetUser: string;
  public profileData: ProfileData;
  public exists: boolean;
  public path: string;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    public profileDataService: ProfiledataService
  ) {
    this.path = env.backendPath
  }

  ngOnInit(): void {
    this.targetUser = this.router.url.split('/')[2];
    this.profileDataService.getProfileData(this.targetUser).subscribe(
      res => {
        if (res === null) {
          this.exists = false
        }
        else {
          this.exists = true;
          this.profileData = res
          this.initForm()
        }
      }
    );
  }

  private initForm(): void {
    this.commentForm = this.fb.group({
      comment: ''
    })
  }

  public addComment(comment: string): void {
    var body = JSON.stringify({
      'username': this.targetUser, // user page
      'commenter': localStorage.getItem('username'), // commenter
      'comment': comment
    })
    this.http.post<any>(
      this.path + '/api/addcomment',
      body
    ).subscribe()
  }

  onSubmit(): void {
    const newComment = this.commentForm.value['comment']
    console.log(newComment)
    this.addComment(newComment)
    this.commentForm.reset()
  }
}
