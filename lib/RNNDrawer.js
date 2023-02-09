"use strict";
/**
 * @author Luke Brandon Farrell
 * @description An animated drawer component for react-native-navigation.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectionType = void 0;
/* NPM - Node Package Manage */
var React = require("react");
var react_native_1 = require("react-native");
var react_native_navigation_1 = require("react-native-navigation");
/* Utils - Project Utilities */
var events_1 = require("./events");
var DirectionType;
(function (DirectionType) {
    DirectionType["left"] = "left";
    DirectionType["right"] = "right";
    DirectionType["bottom"] = "bottom";
    DirectionType["top"] = "top";
})(DirectionType = exports.DirectionType || (exports.DirectionType = {}));
var RNNDrawer = /** @class */ (function () {
    function RNNDrawer() {
    }
    /**
     * Generates the drawer component to
     * be used with react-native-navigation
     *
     * @param component
     */
    RNNDrawer.create = function (Component) {
        var WrappedDrawer = /** @class */ (function (_super) {
            __extends(WrappedDrawer, _super);
            /**
             * [ Built-in React method. ]
             *
             * Setup the component. Executes when the component is created
             *
             * @param {object} props
             */
            function WrappedDrawer(props) {
                var _this = _super.call(this, props) || this;
                _this.panningStartedPoint = { moveX: 0, moveY: 0 };
                _this.startedFromSideMenu = false;
                _this.onOrientationChange = function (_a) {
                    var window = _a.window;
                    var screenHeight = window.height;
                    _this.setState({ screenHeight: screenHeight });
                    // Apply correct position if opened from right
                    if (_this.props.direction === 'right') {
                        // Calculates the position of the drawer from the left side of the screen
                        var alignedMovementValue = window.width - _this.drawerWidth;
                        _this.state.sideMenuOpenValue.setValue(alignedMovementValue);
                    }
                };
                _this.screenWidth = react_native_1.Dimensions.get('window').width;
                _this.screenHeight = react_native_1.Dimensions.get('window').height;
                // _this.panResponder = react_native_1.PanResponder.create({
                //     onStartShouldSetPanResponder: function (_evt, _gestureState) { return false; },
                //     onStartShouldSetPanResponderCapture: function (_evt, _gestureState) { return false; },
                //     onMoveShouldSetPanResponder: function (_evt, _gestureState) {
                //         var dx = _gestureState.dx, dy = _gestureState.dy;
                //         if (_this.props.direction === DirectionType.left ||
                //             _this.props.direction === DirectionType.right)
                //             return Math.abs(dx) > 5;
                //         else
                //             return Math.abs(dy) > 5;
                //     },
                //     onMoveShouldSetPanResponderCapture: function (_evt, _gestureState) { return false; },
                //     onPanResponderGrant: function (_evt, _gestureState) {
                //         var moveX = _gestureState.moveX, moveY = _gestureState.moveY;
                //         events_1.dispatch('SWIPE_START', { moveX: moveX, moveY: moveY });
                //     },
                //     onPanResponderRelease: function (_evt, gestureState) {
                //         var vx = gestureState.vx;
                //         // Emit this event when the gesture ends
                //         events_1.dispatch('SWIPE_END', vx > 0 ? 'right' : 'left');
                //     },
                //     onPanResponderTerminationRequest: function (_evt, _gestureState) { return false; },
                //     onShouldBlockNativeResponder: function (_evt, _gestureState) { return false; },
                //     onPanResponderMove: function (_evt, _gestureState) {
                //         var moveX = _gestureState.moveX, moveY = _gestureState.moveY;
                //         var direction = _this.props.direction || 'left';
                //         events_1.dispatch('SWIPE_MOVE', { value: { moveX: moveX, moveY: moveY }, direction: direction });
                //     },
                // });
                /*
                 * We need to convert the pushed drawer width
                 * to a number as it can either be a string ('20%')
                 * or number (400).
                 */
                var _resolveDrawerSize = function (value, max) {
                    /*
                     * If the type is a string '%' then it should be a percentage relative
                     * to our max size.
                     */
                    if (typeof value === 'string') {
                        var valueAsNumber = parseFloat(value) || 100;
                        var size = max * (valueAsNumber / 100);
                        return size;
                    }
                    return value;
                };
                /** Component Variables */
                _this.drawerWidth = _resolveDrawerSize(_this.isLandscape()
                    ? props.drawerScreenWidthOnLandscape
                    : props.drawerScreenWidth, _this.screenWidth);
                _this.drawerHeight = _resolveDrawerSize(props.drawerScreenHeight, _this.screenHeight);
                _this.drawerOpenedValues = {
                    left: 0,
                    right: _this.screenWidth - _this.drawerWidth,
                    top: _this.drawerHeight - _this.screenHeight,
                    bottom: _this.screenHeight - _this.drawerHeight,
                };
                _this.initialValues = {
                    left: -_this.drawerWidth,
                    right: _this.screenWidth,
                    top: -_this.screenHeight,
                    bottom: _this.screenHeight,
                };
                /** Component State */
                _this.state = {
                    sideMenuOpenValue: new react_native_1.Animated.Value(_this.initialValues[props.direction]),
                    sideMenuOverlayOpacity: new react_native_1.Animated.Value(0),
                    sideMenuSwipingStarted: false,
                    sideMenuIsDismissing: false,
                    screenHeight: _this.screenHeight,
                };
                /** Component Bindings */
                _this.touchedOutside = _this.touchedOutside.bind(_this);
                _this.dismissDrawerWithAnimation = _this.dismissDrawerWithAnimation.bind(_this);
                _this.registerListeners = _this.registerListeners.bind(_this);
                _this.removeListeners = _this.removeListeners.bind(_this);
                _this.isLandscape = _this.isLandscape.bind(_this);
                react_native_navigation_1.Navigation.events().bindComponent(_this);
                return _this;
            }
            /**
             * Check if device is in landscape mode
             */
            WrappedDrawer.prototype.isLandscape = function () {
                var dim = react_native_1.Dimensions.get('window');
                return dim.height <= dim.width;
            };
            /**
             * [ Built-in React method. ]
             *
             * Executed when the component is mounted to the screen
             */
            WrappedDrawer.prototype.componentDidMount = function () {
                /** Props */
                var _a = this.props, direction = _a.direction, fadeOpacity = _a.fadeOpacity, animateDrawerExpanding = _a.animateDrawerExpanding;
                if (typeof animateDrawerExpanding !== 'undefined' &&
                    !animateDrawerExpanding)
                    this.startedFromSideMenu = true;
                // Animate side menu open
                this.animatedDrawer = react_native_1.Animated.timing(this.state.sideMenuOpenValue, {
                    toValue: this.drawerOpenedValues[direction],
                    duration: this.props.animationOpenTime,
                    useNativeDriver: true,
                });
                // Animate outside side menu opacity
                this.animatedOpacity = react_native_1.Animated.timing(this.state.sideMenuOverlayOpacity, {
                    toValue: fadeOpacity,
                    duration: this.props.animationOpenTime,
                    useNativeDriver: true,
                });
            };
            /**
             * [ react-native-navigation method. ]
             *
             * Executed when the component is navigated to view.
             */
            WrappedDrawer.prototype.componentDidAppear = function () {
                this.registerListeners();
                // If there has been no Swiping, and this component appears, then just start the open animations
                if (!this.state.sideMenuSwipingStarted &&
                    this.props.animateDrawerExpanding) {
                    this.animatedDrawer.start();
                    this.animatedOpacity.start();
                }
            };
            /**
             * [ react-native-navigation method. ]
             *
             * Executed when the component is navigated away from view.
             */
            WrappedDrawer.prototype.componentDidDisappear = function () {
                this.removeListeners();
                events_1.dispatch('DRAWER_CLOSED');
            };
            /**
             * Registers all the listenrs for this component
             */
            WrappedDrawer.prototype.registerListeners = function () {
                var _this = this;
                
                // Executes when the drawer needs to be dismissed
                this.unsubscribeDismissDrawer = events_1.listen('DISMISS_DRAWER', function () {
                    if (!_this.state.sideMenuIsDismissing) {
                        _this.dismissDrawerWithAnimation();
                    }
                });

                if (this.props.disableDragging && this.props.disableSwiping) {
                    return;
                }


                /** Props */
                var _a = this.props, direction = _a.direction, fadeOpacity = _a.fadeOpacity;
                // Adapt the drawer's size on orientation change
                react_native_1.Dimensions.addEventListener('change', this.onOrientationChange);
                // Executes when the side of the screen interaction starts
                this.unsubscribeSwipeStart = events_1.listen('SWIPE_START', function (value) {
                    _this.panningStartedPoint.moveX = value.moveX;
                    _this.panningStartedPoint.moveY = value.moveY;
                    _this.setState({
                        sideMenuSwipingStarted: true,
                    });
                });
                // Executes when the side of the screen is interacted with
                this.unsubscribeSwipeMove = events_1.listen('SWIPE_MOVE', function (_a) {
                    var value = _a.value, swipeDirection = _a.direction;
                    // Cover special case when we are swiping from the edge of the screen
                    if (_this.startedFromSideMenu) {
                        if (direction === 'left' && value.moveX < _this.drawerWidth) {
                            _this.state.sideMenuOpenValue.setValue(value.moveX - _this.drawerWidth);
                            var normalizedOpacity_1 = Math.min((value.moveX / _this.drawerWidth) * fadeOpacity, fadeOpacity);
                            _this.state.sideMenuOverlayOpacity.setValue(normalizedOpacity_1);
                        }
                        if (direction === 'right' &&
                            _this.screenWidth - value.moveX < _this.drawerWidth) {
                            _this.state.sideMenuOpenValue.setValue(value.moveX);
                            var normalizedOpacity_2 = Math.min(((_this.screenWidth - value.moveX) / _this.drawerWidth) *
                                fadeOpacity, fadeOpacity);
                            _this.state.sideMenuOverlayOpacity.setValue(normalizedOpacity_2);
                        }
                        return;
                    }
                    if (_this.props.disableDragging)
                        return;
                    // Calculates the translateX / translateY value
                    var alignedMovementValue = 0;
                    // To swap the direction if needed
                    var directionModifier = 1;
                    // Whether we use the height of the drawer or the width
                    var drawerDimension = _this.drawerWidth;
                    if (swipeDirection === 'left') {
                        alignedMovementValue =
                            value.moveX - _this.panningStartedPoint.moveX;
                    }
                    else if (swipeDirection === 'right') {
                        alignedMovementValue =
                            _this.panningStartedPoint.moveX - value.moveX;
                        directionModifier = -1;
                    }
                    else if (swipeDirection === 'bottom') {
                        alignedMovementValue =
                            _this.panningStartedPoint.moveY - value.moveY;
                        directionModifier = -1;
                        drawerDimension = _this.drawerHeight;
                    }
                    else if (swipeDirection === 'top') {
                        alignedMovementValue =
                            value.moveY - _this.panningStartedPoint.moveY;
                        drawerDimension = _this.drawerHeight;
                    }
                    // Calculates the percentage 0 - 1 of which the drawer is open
                    var openedPercentage = Math.abs(drawerDimension + alignedMovementValue) /
                        drawerDimension;
                    // Calculates the opacity to set of the screen based on the percentage the drawer is open
                    var normalizedOpacity = Math.min(openedPercentage * fadeOpacity, fadeOpacity);
                    // Does not allow the drawer to go further than the maximum width / height
                    if (0 > alignedMovementValue) {
                        // Sets the animation values, we use this so we can resume animation from any point
                        _this.state.sideMenuOpenValue.setValue(_this.drawerOpenedValues[direction] +
                            alignedMovementValue * directionModifier);
                        _this.state.sideMenuOverlayOpacity.setValue(normalizedOpacity);
                    }
                });
                // Executes when the side of the screen interaction ends
                this.unsubscribeSwipeEnd = events_1.listen('SWIPE_END', function (swipeDirection) {
                    if (_this.props.disableSwiping && !_this.startedFromSideMenu)
                        return;
                    var reverseDirection = {
                        right: 'left',
                        left: 'right',
                        top: 'bottom',
                        bottom: 'top',
                    };
                    // In case the drawer started by dragging the edge of the screen reset the flag
                    _this.startedFromSideMenu = false;
                    if (swipeDirection === reverseDirection[direction]) {
                        _this.animatedDrawer.start();
                        _this.animatedOpacity.start();
                    }
                    else {
                        if (!_this.state.sideMenuIsDismissing) {
                            _this.setState({
                                sideMenuIsDismissing: true,
                            }, function () {
                                _this.dismissDrawerWithAnimation();
                            });
                        }
                    }
                });
            };
            /**
             * Removes all the listenrs from this component
             */
            WrappedDrawer.prototype.removeListeners = function () {
                react_native_1.Dimensions.removeEventListener('change', this.onOrientationChange);
                if (this.unsubscribeSwipeStart)
                    this.unsubscribeSwipeStart();
                if (this.unsubscribeSwipeMove)
                    this.unsubscribeSwipeMove();
                if (this.unsubscribeSwipeEnd)
                    this.unsubscribeSwipeEnd();
                if (this.unsubscribeDismissDrawer)
                    this.unsubscribeDismissDrawer();
            };
            /**
             * [ Built-in React method. ]
             *
             * Allows us to render JSX to the screen
             */
            WrappedDrawer.prototype.render = function () {
                /** Styles */
                var sideMenuOverlayStyle = styles.sideMenuOverlayStyle, sideMenuContainerStyle = styles.sideMenuContainerStyle;
                /** Props */
                var _a = this.props, direction = _a.direction, style = _a.style;
                /** State */
                var _b = this.state, sideMenuOpenValue = _b.sideMenuOpenValue, sideMenuOverlayOpacity = _b.sideMenuOverlayOpacity;
                /** Variables */
                var animatedValue = direction === DirectionType.left || direction === DirectionType.right
                    ? { translateX: sideMenuOpenValue }
                    : { translateY: sideMenuOpenValue };
                //return (React.createElement(react_native_1.View, __assign({ style: sideMenuContainerStyle }, this.panResponder.panHandlers),
                return (React.createElement(react_native_1.View, __assign({ style: sideMenuContainerStyle }, null),
                    React.createElement(react_native_1.TouchableWithoutFeedback, { onPress: this.touchedOutside },
                        React.createElement(react_native_1.Animated.View, { style: [
                                sideMenuOverlayStyle,
                                { opacity: sideMenuOverlayOpacity },
                            ] })),
                    React.createElement(react_native_1.Animated.View, { style: [
                            { backgroundColor: '#FFF' },
                            style,
                            {
                                height: this.state.screenHeight,
                                width: this.drawerWidth,
                                transform: [animatedValue],
                            },
                        ] },
                        React.createElement(Component, __assign({}, this.props)))));
            };
            /**
             * Touched outside drawer
             */
            WrappedDrawer.prototype.touchedOutside = function () {
                var dismissWhenTouchOutside = this.props.dismissWhenTouchOutside;
                if (dismissWhenTouchOutside) {
                    this.dismissDrawerWithAnimation();
                }
            };
            /**
             * Dismisses drawer with animation
             */
            WrappedDrawer.prototype.dismissDrawerWithAnimation = function () {
                var _this = this;
                var direction = this.props.direction;
                var sideMenuIsDismissing = this.state.sideMenuIsDismissing;
                var closeValues = {
                    left: -this.drawerWidth,
                    right: this.screenWidth,
                    top: -this.screenHeight,
                    bottom: this.screenHeight,
                };
                // Animate side menu close
                react_native_1.Animated.timing(this.state.sideMenuOpenValue, {
                    toValue: closeValues[direction],
                    duration: this.props.animationCloseTime,
                    useNativeDriver: true,
                }).start(function () {
                    react_native_navigation_1.Navigation.dismissOverlay(_this.props.componentId);
                    _this.setState({ sideMenuIsDismissing: false });
                });
                // Animate outside side menu opacity
                react_native_1.Animated.timing(this.state.sideMenuOverlayOpacity, {
                    toValue: 0,
                    duration: this.props.animationCloseTime,
                    useNativeDriver: true,
                }).start();
            };
            WrappedDrawer.defaultProps = {
                animationOpenTime: 300,
                animationCloseTime: 300,
                direction: 'left',
                dismissWhenTouchOutside: true,
                fadeOpacity: 0.6,
                drawerScreenWidth: '80%',
                drawerScreenWidthOnLandscape: '30%',
                drawerScreenHeight: '100%',
                animateDrawerExpanding: true,
                disableDragging: false,
                disableSwiping: false,
            };
            return WrappedDrawer;
        }(React.Component));
        return WrappedDrawer;
    };
    /**
     * Shows a drawer component
     *
     * @param layout
     */
    RNNDrawer.showDrawer = function (layout) {
        var _a, _b, _c, _d, _e;
        // By default for this library, we make the 'componentBackgroundColor' transparent
        var componentBackgroundColor = (_d = (_c = (_b = (_a = layout === null || layout === void 0 ? void 0 : layout.component) === null || _a === void 0 ? void 0 : _a.options) === null || _b === void 0 ? void 0 : _b.layout) === null || _c === void 0 ? void 0 : _c.componentBackgroundColor) !== null && _d !== void 0 ? _d : 'transparent';
        var options = __assign(__assign({}, (_e = layout === null || layout === void 0 ? void 0 : layout.component) === null || _e === void 0 ? void 0 : _e.options), { layout: {
                componentBackgroundColor: componentBackgroundColor,
            } });
        // Mutate options to add 'transparent' by default
        // @ts-ignore
        layout.component.options = __assign({}, options);
        react_native_navigation_1.Navigation.showOverlay(layout);
    };
    /**
     * Dismiss the drawer component
     */
    RNNDrawer.dismissDrawer = function () {
        events_1.dispatch('DISMISS_DRAWER', true);
    };
    return RNNDrawer;
}());
exports.default = RNNDrawer;
/** -------------------------------------------- */
/**             Component Styling                */
/** -------------------------------------------- */
var styles = react_native_1.StyleSheet.create({
    sideMenuContainerStyle: {
        flex: 1,
        flexDirection: 'row',
    },
    sideMenuOverlayStyle: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
    },
});
