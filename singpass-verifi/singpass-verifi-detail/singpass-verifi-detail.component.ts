import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injectable,
  ViewChild,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { DictBaseDetail } from 'src/app/controls-new/fts-dict-base/fts-dict-base-detail/fts-dict-base-detail.base';
import { FtsDictBaseDetailComponent } from 'src/app/controls-new/fts-dict-base/fts-dict-base-detail/fts-dict-base-detail.component';
import {
  DICT_BASE_DETAIL_STORE,
  DictBaseDetailState,
  DictBaseDetailStore,
} from 'src/app/controls-new/fts-dict-base/fts-dict-base-detail/fts-dict-base-detail.store';
import { FtsDropdownComponent } from 'src/app/controls-new/fts-dropdown/fts-dropdown.component';
import { FtsFormControlComponent } from 'src/app/controls-new/fts-form-control/fts-form-control.component';
import { FtsLabelComponent } from 'src/app/controls-new/fts-label/fts-label.component';
import { FtsTextLookupComponent } from 'src/app/controls-new/fts-text-lookup/fts-text-lookup.component';
import { FtsTextareaComponent } from 'src/app/controls-new/fts-textarea/fts-textarea.component';
import { DmInvestorSelectorService } from 'src/app/model/dictionary/dm-investor-selector/dm-investor-selector.service';
import { DmInvestorService } from 'src/app/model/dictionary/dm-investor/dm-investor.service';
import { CommonService } from 'src/app/model/system/common/common.service';
import { SingpassVerifiService } from 'src/app/model/system/singpass-verifi/singpass-verifi.service';
import { DmInvestorProfileDetailComponent } from 'src/app/pages/dictionary/dm-investor-profile/dm-investor-profile-detail/dm-investor-profile-detail.component';
import { DmInvestorDetailComponent } from 'src/app/pages/dictionary/dm-investor/dm-investor-detail/dm-investor-detail.component';

export class SingpassVerifiState extends DictBaseDetailState {}

@Injectable()
export class SingpassVerifiStore extends DictBaseDetailStore<SingpassVerifiState> {
  override getInitState(): SingpassVerifiState {
    return new SingpassVerifiState();
  }
}
@Component({
  selector: 'singpass-verifi-detail',
  templateUrl: './singpass-verifi-detail.component.html',
  styleUrls: ['./singpass-verifi-detail.component.scss'],
  standalone: true,
  providers: [
    {
      provide: DICT_BASE_DETAIL_STORE,
      useClass: SingpassVerifiStore,
    },
  ],
  imports: [
    CommonModule,
    FtsFormControlComponent,
    FtsDictBaseDetailComponent,
    FtsDropdownComponent,
    ReactiveFormsModule,
    FtsLabelComponent,
    FtsTextLookupComponent,
    // FtsTextareaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SingpassVerifiDetailComponent extends DictBaseDetail<
  SingpassVerifiState,
  SingpassVerifiStore
> {
  tableName: string = 'SINGPASS_VERIFI';
  fieldId: string = 'PR_KEY';
  fieldName: string = 'TRAN_NO';
  isShowPrint: boolean = true;

  protected service = inject(SingpassVerifiService);

  textLookupService = {
    dmTranStatusService: inject(CommonService),
    dmInvestorService: inject(DmInvestorService),
    dmInvestorSelectorService: inject(DmInvestorSelectorService),
  };

  typesTextLookup = {
    dmInvestorProfileDetail: DmInvestorProfileDetailComponent,
  };

  types = {
    dmInvestor: DmInvestorDetailComponent,
  };
  ngOnInit(): void {
    super.ngOnInit();
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public async loadOtherDm() {
    const [TranStatusList] = await Promise.all([
      this.textLookupService.dmTranStatusService.GetTranStatusList(),
    ]);
    return {
      TranStatusList,
    };
  }
}
