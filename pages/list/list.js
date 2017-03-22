const AV = require('../../libs/av-weapp-min.js');

Page({
    data: {
        cars: [],
        toggle_option: false,
        lastSearch: ''
    },

    fetchCars: function () {
        return new AV.Query('Car')
            .descending('createdAt')
            .find()
            .then(this.setCars)
            .catch(console.error);
    },

    onPullDownRefresh: function () {
        this.fetchCars().then(wx.stopPullDownRefresh);
    },

    setCars: function (cars) {
        this.setData({
            cars,
        });
    },

    onShow() {
        this.fetchCars();
    },

    onLoad(query) {
        const role = wx.getStorageSync('role');
        console.log("brand: " + query.brand)
        this.setData({
            role,
        })
    },

    transitionToEdit(e){
        wx.navigateTo({
            redirect: "true",
            url: `../car/car?id=${e.target.dataset.id}`
        });
    },

    transitionToDetail(e){
        wx.navigateTo({
            redirect: "true",
            url: `../detail/detail?id=${e.target.dataset.id}`
        });
    },

    deleteCar(e){
        console.log(e.currentTarget.dataset.id);
        AV.Query.doCloudQuery(`delete from Car where objectId="${e.currentTarget.dataset.id}"`).then(()=> {
            wx.showToast({
                title: "删除成功",
                mask: true,
                duration: 1000
            });
            this.fetchCars();
        }).catch(()=> {
            wx.showToast({
                title: '失败',
                mask: true,
                duration: 1000
            })
        })
    },

    updateOptionToggle(e) {
        var oldOptionToggle = this.data.toggle_option;
        var that = this
        wx.getStorage({
            key: 'role',
            success: function(res) {
                console.log(res)
                if (res.data === 'ADMIN') {
                    that.setData({
                        toggle_option: !oldOptionToggle
                    })
                }
            }
        });
    },

    performSearch() {
        var that = this;
        console.log(this.data.lastSearch);
        var query = new AV.Query('Car');
        query.contains('brand', this.data.lastSearch);
        query.contains('model', this.data.lastSearch);
        query.find().then(function (results) {
            that.setData({
                cars: results
            })
        }, function (error) {
        });
    },
    
    updateSearch(e) {
        this.setData({
            lastSearch: e.detail.value
        });
    }
});
