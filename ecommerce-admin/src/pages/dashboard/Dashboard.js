import {
  MDBBadge,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBDatePicker,
  MDBIcon,
  MDBProgress,
  MDBRow,
  MDBSelect,
  MDBView,
  MDBCardHeader,
} from 'mdbreact';
import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import './Dashboard.css';
import { BarChart } from '../chart/BarChart';
import { LineChart } from '../chart/LineChart';
import { actionGetStatistics, actionGetStatisticsRevenue } from '../../datas/redux/AdminAction';
import { endOfMonth, endOfYear, fromToNextYear, startOfMonth, startOfYear } from '../../utils/Util';

const StatisticsBy = {
  MONTH: '1',
  YEAR: '2',
};

class DashboardComponent extends React.Component {
  state = {
    prevOrderDone: { totalOrder: 0, totalMoney: 0 },
    curOrderDone: { totalOrder: 0, totalMoney: 0 },

    prevRegistered: { totalRegistered: 0 },
    curRegistered: { totalRegistered: 0 },

    prevComment: { totalCommented: 0 },
    curComment: { totalCommented: 0 },

    bookSold: [],

    draftFromDate: undefined,
    draftToDate: undefined,

    draftTimeType: undefined,
    statisticsByOptions: undefined,

    dataset: [],
  };

  constructor(props) {
    super(props);
    const { fromDate, toDate } = fromToNextYear();
    this.state.draftFromDate = fromDate;
    this.state.draftToDate = toDate;

    this.state.draftTimeType = StatisticsBy.MONTH;
    this.state.statisticsByOptions = this.initStatisticsByOptions();
  }

  initStatisticsByOptions = (select = StatisticsBy.MONTH) => [
    {
      text: 'Loại thời gian',
      disabled: true,
    },
    {
      text: 'Theo tháng',
      value: StatisticsBy.MONTH,
      checked: select === StatisticsBy.MONTH,
    },
    {
      text: 'Theo năm',
      value: StatisticsBy.YEAR,
      checked: select === StatisticsBy.YEAR,
    },
  ];

  getStart = (date, type) => {
    const { draftTimeType } = this.state;
    type = type || draftTimeType;
    return type === StatisticsBy.MONTH ? startOfMonth(date) : startOfYear(date);
  };

  getEnd = (date, type) => {
    const { draftTimeType } = this.state;
    type = type || draftTimeType;
    return type === StatisticsBy.MONTH ? endOfMonth(date) : endOfYear(date);
  };

  handleChangeFromDate = (value) => {
    if (value.getTime() !== this.state.draftFromDate.getTime()) {
      this.setState({ draftFromDate: this.getStart(value) }, this.handleGetStatisticsRevenue);
    }
  };

  handleChangeToDate = (value) => {
    if (value.getTime() !== this.state.draftToDate.getTime()) {
      this.setState({ draftToDate: this.getEnd(value) }, this.handleGetStatisticsRevenue);
    }
  };

  handleSelectTimeType = (value) => {
    if (value[0]) {
      if (this.state.draftTimeType === value[0]) {
        return;
      }
      const { draftFromDate, draftToDate } = this.state;
      const updateState = {};
      updateState.draftFromDate = this.getStart(draftFromDate, value[0]);
      updateState.draftToDate = this.getEnd(draftToDate, value[0]);

      if (value[0] === StatisticsBy.YEAR) {
        updateState.draftToDate.setFullYear(updateState.draftFromDate.getFullYear() + 1);
      }
      this.setState(
        {
          draftTimeType: value[0],
          ...updateState,
        },
        this.handleGetStatisticsRevenue
      );
    } else {
      this.setState({
        statisticsByOptions: this.initStatisticsByOptions(this.state.draftTimeType),
      });
    }
  };

  extractStatistics = (statistics) => {
    const prevMonth = `${new Date().getMonth()}`;
    const curMonth = `${new Date().getMonth() + 1}`;
    if (statistics) {
      const prevOrderDone = statistics.orderDone.find((item) => item.month === prevMonth);
      const curOrderDone = statistics.orderDone.find((item) => item.month === curMonth);

      const prevRegistered = statistics.userRegistered.find((item) => item.month === prevMonth);
      const curRegistered = statistics.userRegistered.find((item) => item.month === curMonth);

      const prevComment = statistics.comment.find((item) => item.month === prevMonth);
      const curComment = statistics.comment.find((item) => item.month === curMonth);

      this.setState({
        prevOrderDone: prevOrderDone
          ? {
              totalOrder: +prevOrderDone.totalOrder,
              totalMoney: prevOrderDone.totalMoney !== null ? +prevOrderDone.totalMoney : 0,
            }
          : {},
        curOrderDone: curOrderDone
          ? {
              totalOrder: +curOrderDone.totalOrder,
              totalMoney: curOrderDone.totalMoney !== null ? +curOrderDone.totalMoney : 0,
            }
          : {},

        prevRegistered: {
          totalRegistered: prevRegistered ? +prevRegistered.totalRegistered : 0,
        },
        curRegistered: {
          totalRegistered: curRegistered ? +curRegistered.totalRegistered : 0,
        },

        prevComment: {
          totalCommented: prevComment ? +prevComment.totalCommented : 0,
        },
        curComment: {
          totalCommented: curComment ? +curComment.totalCommented : 0,
        },

        bookSold: statistics.bookSold,
      });
    }
  };

  handleGetStatisticsRevenue = () => {
    const { draftTimeType, draftFromDate, draftToDate } = this.state;
    const { actionGetStatisticsRevenue } = this.props;
    actionGetStatisticsRevenue({ fromDate: draftFromDate, toDate: draftToDate, timeType: draftTimeType });
  };

  componentDidMount() {
    const { actionGetStatistics } = this.props;
    actionGetStatistics();
    this.handleGetStatisticsRevenue();
  }

  componentDidUpdate(prevProps) {
    const { statistics, statisticsRevenue } = this.props;

    if (statistics !== prevProps.statistics) {
      this.extractStatistics(statistics);
    }

    if (statisticsRevenue !== prevProps.statisticsRevenue) {
      const { draftTimeType, draftToDate, draftFromDate } = this.state;

      const dataset = [];

      if (draftTimeType === StatisticsBy.MONTH) {
        const fromMonth = ('00' + (draftFromDate.getMonth() + 1)).slice(-2);
        const fromYear = draftFromDate.getFullYear();
        const toMonth = ('00' + (draftToDate.getMonth() + 1)).slice(-2);
        const toYear = draftToDate.getFullYear();

        const lableFrom = `${fromYear}/${fromMonth}`;
        const lableTo = `${toYear}/${toMonth}`;

        for (let year = fromYear; year <= toYear; year++) {
          statisticsRevenue[year].forEach((item) => {
            const lable = `${year}/${('00' + item.month).slice(-2)}`;
            // console.log(lable, lableFrom, lableTo);
            if (lable >= lableFrom && lable <= lableTo) {
              dataset.push({
                label: `${('00' + item.month).slice(-2)}/${year}`,
                value: (item.totalMoney && +item.totalMoney) || 0,
              });
            }
          });
        }
      } else {
        const fromYear = draftFromDate.getFullYear();
        const toYear = draftToDate.getFullYear();

        for (let year = fromYear; year <= toYear; year++) {
          let value = statisticsRevenue && statisticsRevenue.find((item) => item.year === year);
          dataset.push({
            label: `${year}`,
            value: (value && +value.totalOrder) || 0,
          });
        }
      }

      console.log(dataset);
      this.setState({ dataset: dataset });
    }
  }

  percent(a, b) {
    if (!b) {
      return a ? 100 : 0;
    }
    return Math.floor(((a - b) * 100) / b);
  }

  betterOrWorse(value) {
    return value < 0 ? 'Worse' : 'Better';
  }

  render() {
    const {
      prevOrderDone,
      curOrderDone,
      prevRegistered,
      curRegistered,
      prevComment,
      curComment,
      bookSold,
      draftFromDate,
      draftToDate,
      draftTimeType,
      statisticsByOptions,
      dataset,
    } = this.state;

    const percentOrderMoney = this.percent(curOrderDone.totalMoney, prevOrderDone.totalMoney);
    const percentOrderTotal = this.percent(curOrderDone.totalOrder, prevOrderDone.totalOrder);
    const percentRegistered = this.percent(curRegistered.totalRegistered, prevRegistered.totalRegistered);
    const percentComment = this.percent(curComment.totalCommented, prevComment.totalCommented);

    const labelFrom = draftTimeType === StatisticsBy.MONTH ? 'từ tháng' : 'từ năm';
    const labelTo = draftTimeType === StatisticsBy.MONTH ? 'đến tháng' : 'đến năm';
    const views = draftTimeType === StatisticsBy.MONTH ? ['year', 'month'] : ['year'];
    const format = draftTimeType === StatisticsBy.MONTH ? 'MM/YYYY' : 'YYYY';

    return (
      <MDBContainer fluid>
        <section className='mb-5'>
          <MDBRow>
            <MDBCol xl='3' md='6' className='mb-4'>
              <MDBCard color='primary-color' className='classic-admin-card white-text'>
                <MDBCardBody>
                  <div className='float-right'>
                    <MDBIcon icon='money-bill-alt' />
                  </div>
                  <p className='white-text'>BÁN HÀNG</p>
                  <h4>{curOrderDone.totalMoney}</h4>
                </MDBCardBody>

                <MDBProgress
                  value={percentOrderMoney}
                  barClassName='bg grey darken-3'
                  height='6px'
                  wrapperStyle={{ opacity: '.7' }}
                />

                <MDBCardBody>
                  <p>
                    {this.betterOrWorse(percentOrderMoney)} than last month ({Math.abs(percentOrderMoney)}%)
                  </p>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

            <MDBCol xl='3' md='6' className='mb-4'>
              <MDBCard color='red accent-2' className='classic-admin-card white-text'>
                <MDBCardBody>
                  <div className='float-right'>
                    <MDBIcon icon='chart-bar' />
                  </div>
                  <p className='white-text'>ĐƠN HÀNG</p>
                  <h4>{curOrderDone.totalOrder}</h4>
                </MDBCardBody>

                <MDBProgress
                  value={percentOrderTotal}
                  barClassName='bg grey darken-3'
                  height='6px'
                  wrapperStyle={{ opacity: '.7' }}
                />

                <MDBCardBody>
                  <p>
                    {this.betterOrWorse(percentOrderTotal)} than last month ({percentOrderTotal}%)
                  </p>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

            <MDBCol xl='3' md='6' className='mb-4'>
              <MDBCard color='warning-color' className='classic-admin-card white-text'>
                <MDBCardBody>
                  <div className='float-right'>
                    <MDBIcon icon='chart-line' />
                  </div>
                  <p className='white-text'>ĐĂNG KÝ</p>
                  <h4>{curRegistered.totalRegistered}</h4>
                </MDBCardBody>
                <MDBProgress
                  value={percentRegistered}
                  barClassName='bg grey darken-3'
                  height='6px'
                  wrapperStyle={{ opacity: '.7' }}
                />
                <MDBCardBody>
                  <p>
                    {this.betterOrWorse(percentRegistered)} than last month ({percentRegistered}%)
                  </p>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>

            <MDBCol xl='3' md='6' className='mb-4'>
              <MDBCard color='info-color' className='classic-admin-card white-text'>
                <MDBCardBody>
                  <div className='float-right'>
                    <MDBIcon icon='chart-pie' />
                  </div>
                  <p className='white-text'>BÌNH LUẬN</p>
                  <h4>{curComment.totalCommented}</h4>
                </MDBCardBody>

                <MDBProgress
                  value={percentComment}
                  barClassName='bg grey darken-3'
                  height='6px'
                  wrapperStyle={{ opacity: '.7' }}
                />

                <MDBCardBody>
                  <p>
                    {this.betterOrWorse(percentComment)} than last month ({percentComment}%)
                  </p>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </section>
        <section className='mb-5'>
          <MDBCard className='p-4'>
            <MDBRow>
              <MDBCol xl='5' md='12' className='mr-0'>
                {/* <MDBView>
                  <h4 className='text-center h4-responsive mb-0 font-weight-bold'>Doanh Thu</h4>
                </MDBView> */}
                <MDBCardBody className='pb-3'>
                  <MDBRow className='pt-3 card-body'>
                    <MDBCol md='12'>
                      <h4>
                        <MDBBadge className=''>Thời gian</MDBBadge>
                      </h4>
                      <MDBSelect required options={statisticsByOptions} getValue={this.handleSelectTimeType} />
                      <h5>
                        <MDBBadge className='big-badge light-blue lighten-1'>Tùy chọn thời gian</MDBBadge>
                      </h5>
                      <br />
                      <div className='mb-1'>
                        <MDBRow>
                          <MDBCol size='6'>
                            <small className='grey-text'>{labelFrom}:</small>
                            <div className='date-picker-w-100 mt-0'>
                              <MDBDatePicker
                                openTo='year'
                                views={views}
                                format={format}
                                value={draftFromDate}
                                className='my-0 d-inline'
                                valueDefault={null}
                                getValue={this.handleChangeFromDate}
                              />
                            </div>
                          </MDBCol>
                          <MDBCol size='6'>
                            <small className='grey-text'>{labelTo}:</small>
                            <div className='date-picker-w-100 mt-0'>
                              <MDBDatePicker
                                openTo='year'
                                views={views}
                                format={format}
                                value={draftToDate}
                                className='my-0 d-inline'
                                valueDefault={null}
                                getValue={this.handleChangeToDate}
                              />
                            </div>
                          </MDBCol>
                        </MDBRow>
                      </div>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCol>
              <MDBCol md='12' xl='7'>
                <MDBView className='gradient-card-header white'>
                  <BarChart dataset={dataset} />
                </MDBView>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </section>
        <section className='mb-5'>
          <MDBCard className='dashboard-card'>
            <MDBCardHeader className='text-lg-left'>SỐ LƯỢNG SÁCH ĐÃ BÁN</MDBCardHeader>
            <MDBCardBody>
              <LineChart bookSold={bookSold} />
            </MDBCardBody>
          </MDBCard>
        </section>
      </MDBContainer>
    );
  }
}

const mapStateToProps = (state) => {
  const { statistics, statisticsRevenue } = state.AdminReducer || {};
  return { statistics, statisticsRevenue };
};
export const Dashboard = connect(mapStateToProps, {
  actionGetStatistics,
  actionGetStatisticsRevenue,
})(withRouter(DashboardComponent));
