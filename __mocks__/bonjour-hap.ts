class Advertisement {
  updateTxt = jest.fn();
  stop = jest.fn().mockImplementation(callback => {
    callback && callback()
  });
  destroy = jest.fn();
}

class BonjourService {
  publish = jest.fn(() => {
    return new Advertisement();
  });
  destroy = jest.fn();
}

export default (opts: any) => {
  return new BonjourService();
}
