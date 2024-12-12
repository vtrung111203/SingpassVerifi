import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  Injectable,
} from '@angular/core';
import { commonFunction } from 'src/app/common/commonFunction';
import { FuncConfig } from 'src/app/controls-new/common/func-config.interface';
import { FtsDictBaseListingBaseComponent } from 'src/app/controls-new/fts-dict-base/fts-dict-base-listing/fts-dict-base-listing-base/fts-dict-base-listing-base.component';
import { FtsDictBaseListingComponent } from 'src/app/controls-new/fts-dict-base/fts-dict-base-listing/fts-dict-base-listing.component';
import {
  DICT_BASE_LISTING_STORE,
  DictBaseListingState,
  DictBaseListingStore,
} from 'src/app/controls-new/fts-dict-base/fts-dict-base-listing/fts-dict-base-listing.store';
import { FtsColumn } from 'src/app/controls-new/fts-grid/interface/fts-column';
import { FtsPeriodComponent } from 'src/app/controls-new/fts-period/fts-period.component';
import { PagingParam } from 'src/app/model/base/paging/paging-param';
import { Period } from 'src/app/model/other/period';
import { CommonService } from 'src/app/model/system/common/common.service';
import { SingpassVerifiService } from 'src/app/model/system/singpass-verifi/singpass-verifi.service';

export class SingpassVerifiListingState extends DictBaseListingState {
  periodDatas: Period[] = [];
  period: Period = {} as Period;
}

@Injectable()
export class SingpassVerifiListingStore extends DictBaseListingStore<SingpassVerifiListingState> {
  override getInitState(): SingpassVerifiListingState {
    const state = new SingpassVerifiListingState();
    return state;
  }
}

@Component({
  selector: 'singpass-verifi-listing',

  templateUrl: './singpass-verifi-listing.component.html',
  styleUrls: ['./singpass-verifi-listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule, FtsDictBaseListingBaseComponent, FtsPeriodComponent],
  providers: [
    {
      provide: DICT_BASE_LISTING_STORE,
      useClass: SingpassVerifiListingStore,
    },
  ],
})
export class SingpassVerifiListingComponent extends FtsDictBaseListingComponent<
  SingpassVerifiListingState,
  SingpassVerifiListingStore
  // DictBaseListingState,
  // DictBaseListingStore<DictBaseListingState>
> {
  protected service = inject(SingpassVerifiService);
  commonService = inject(CommonService);
  protected override async loadOtherDm() {
    const [ActionTypeList] = await Promise.all([
      this.service.GetActionTypeList(),
    ]);
    return { ActionTypeList };
  }

  override generateColumn(
    configs: FuncConfig[],
    config: FuncConfig,
    column: Partial<FtsColumn> = {}
  ): FtsColumn | undefined {
    const otherDm = this.state.otherDm;
    switch (config.CONFIG_NAME) {
      case 'STATUS_ID':
        column = {
          ...column,
          ColumnType: 'combo',
          Data: otherDm.TranStatusList,
          ValueField: 'STATUS_ID',
          TextField: 'STATUS_NAME',
          ShowText: true,
        };
        break;
    }
    return super.generateColumn(configs, config, column);
  }

  onPeriodChange(v: any) {
    this.store.setValue('period', v);
  }

  async onSearch() {
    try {
      this.showLoading();
      await this.loadData();
    } catch (error) {
      this.processException(error);
    } finally {
      this.hideLoading();
    }
  }

  override async beforLoadData(param: PagingParam) {
    const state = this.state;
    if (param) {
      if (!param.FilterGroups) {
        param.FilterGroups = [];
      }
      param.FilterGroups.push({
        Filters: [
          {
            Field: 'TRAN_DATE', //sau đổi lại thành TRAN_DATE
            Operator: 'gte',
            Value: state.period.FromDate,
          },
          {
            Field: 'TRAN_DATE', //sau đổi lại thành TRAN_DATE
            Operator: 'lt',
            Value: commonFunction.addDay(state.period.ToDate, 1),
          },
        ],
        Logic: 'and',
      });

      param.Sorts = [
        {
          Field: 'TRAN_DATE',
          Dir: 'desc',
        },
        {
          Field: 'TRAN_NO',
          Dir: 'desc',
        },
      ];
    }
    return param;
  }

  // ngOnInit(): void {
  //   super.ngOnInit();

  //   const datas = commonFunction.getPeriod(
  //     this.ftsMain,
  //     this.commonResource,
  //     true,
  //     true,
  //     false,
  //     true
  //   );
  //   this.store.setValue('periodDatas', datas);
  //   if (datas.length) {
  //     const newPeriod = datas.find((x) => x.Id == this.state.period.Id);
  //     if (newPeriod) {
  //       this.store.setValue('period', newPeriod);
  //     } else {
  //       this.store.setValue('period', datas[0]);
  //     }
  //   }
  // }

  ngOnInit(): void {
    super.ngOnInit();
    const state = this.state;
    const datas = commonFunction.getPeriod(
      this.ftsMain,
      this.commonResource,
      true,
      true,
      false,
      true
    );
    this.store.setValue('periodDatas', datas);
    if (datas.length) {
      const newPeriod = datas.find((x) => x.Id == state.period.Id);
      if (newPeriod) {
        this.store.setValue('period', newPeriod);
      } else {
        this.store.setValue('period', datas[0]);
      }
    }
  }

  ngAfterViewInit(): void {
    super.ngAfterViewInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
  }
}
