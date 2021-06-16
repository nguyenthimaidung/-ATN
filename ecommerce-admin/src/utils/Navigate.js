export const Navigate = {
  goTo: (url) =>
    function () {
      const { history } = this.props;
      history && history.push(url);
      window.scrollTo({ top: 0 });
    },
  scrollToTop: () => {
    window.scrollTo({ top: 0 });
  },
};
