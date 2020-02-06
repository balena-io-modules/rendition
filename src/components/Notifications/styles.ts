import { css } from 'styled-components';

export const styles = css`
	.notification-container-bottom-center,
	.notification-container-bottom-left,
	.notification-container-bottom-right,
	.notification-container-top-center,
	.notification-container-top-left,
	.notification-container-top-right {
		width: 325px;
		position: absolute;
		pointer-events: all;
	}
	.notification-container-top-center {
		transform: translateX(-50%);
		top: 20px;
		left: 50%;
	}
	.notification-container-bottom-center {
		transform: translateX(-50%);
		bottom: 20px;
		left: 50%;
	}
	.notification-container-top-left {
		left: 20px;
		top: 20px;
	}
	.notification-container-top-right {
		right: 20px;
		top: 20px;
	}
	.notification-container-bottom-left {
		left: 20px;
		bottom: 20px;
	}
	.notification-container-bottom-right {
		bottom: 20px;
		right: 20px;
	}
	.notification-container-mobile-bottom,
	.notification-container-mobile-top {
		pointer-events: all;
		position: absolute;
	}
	.notification-container-mobile-top {
		right: 20px;
		left: 20px;
		top: 20px;
	}
	.notification-container-mobile-bottom {
		right: 20px;
		left: 20px;
		bottom: 20px;
		margin-bottom: -15px;
	}
	.notification-default {
		border-left: 8px solid #0562c7;
	}
	.notification-default,
	.notification-default .timer {
		background-color: #007bff;
	}
	.notification-default .timer-filler {
		background-color: #fff;
	}
	.notification-default .notification-close {
		background-color: #007bff;
	}
	.notification-success {
		border-left: 8px solid #1f8838;
	}
	.notification-success,
	.notification-success .timer {
		background-color: #28a745;
	}
	.notification-success .timer-filler {
		background-color: #fff;
	}
	.notification-success .notification-close {
		background-color: #28a745;
	}
	.notification-danger {
		border-left: 8px solid #bd1120;
	}
	.notification-danger,
	.notification-danger .timer {
		background-color: #dc3545;
	}
	.notification-danger .timer-filler {
		background-color: #fff;
	}
	.notification-danger .notification-close {
		background-color: #dc3545;
	}
	.notification-info {
		border-left: 8px solid #138b9e;
	}
	.notification-info,
	.notification-info .timer {
		background-color: #17a2b8;
	}
	.notification-info .timer-filler {
		background-color: #fff;
	}
	.notification-info .notification-close {
		background-color: #17a2b8;
	}
	.notification-warning {
		border-left: 8px solid #ce9c09;
	}
	.notification-warning,
	.notification-warning .timer {
		background-color: #eab000;
	}
	.notification-warning .timer-filler {
		background-color: #fff;
	}
	.notification-warning .notification-close {
		background-color: #eab000;
	}
	.notification-awesome {
		border-left: 8px solid #4c3fb1;
	}
	.notification-awesome,
	.notification-awesome .timer {
		background-color: #685dc3;
	}
	.notification-awesome .timer-filler {
		background-color: #fff;
	}
	.notification-awesome .notification-close {
		background-color: #685dc3;
	}
	@keyframes timer {
		0% {
			width: 100%;
		}
		to {
			width: 0;
		}
	}
	.react-notification-root {
		position: fixed;
		z-index: 9000;
		pointer-events: none;
		width: 100%;
		height: 100%;
	}
	.notification-item {
		display: flex;
		position: relative;
		border-radius: 3px;
		margin-bottom: 15px;
		box-shadow: 1px 3px 4px rgba(0, 0, 0, 0.2);
		cursor: pointer;
	}
	.notification-item .timer {
		width: 100%;
		margin-top: 10px;
	}
	.notification-item .timer,
	.notification-item .timer .timer-filler {
		height: 3px;
		border-radius: 5px;
	}
	.notification-item .notification-title {
		color: #fff;
		font-weight: 700;
		font-size: 14px;
		margin-top: 5px;
		margin-bottom: 5px;
	}
	.notification-item .notification-message {
		color: #fff;
		max-width: calc(100% - 15px);
		font-size: 14px;
		line-height: 150%;
		word-wrap: break-word;
		margin-bottom: 0;
		margin-top: 0;
	}
	.notification-item .notification-content {
		padding: 8px 15px;
		display: inline-block;
		width: 100%;
	}
	.notification-item .notification-close {
		width: 18px;
		height: 18px;
		border-radius: 50%;
		display: inline-block;
		position: absolute;
		right: 10px;
		top: 10px;
	}
	.notification-item .notification-close:after {
		content: '\D7';
		position: absolute;
		transform: translate(-50%, -50%);
		color: #fff;
		font-size: 12px;
		left: 50%;
		top: 50%;
	}
	.n-parent {
		width: 275px;
	}
	.notification-container-mobile-bottom .n-parent,
	.notification-container-mobile-bottom .notification-item,
	.notification-container-mobile-top .n-parent,
	.notification-container-mobile-top .notification-item {
		max-width: 100%;
		width: 100%;
	}
	.notification-container-bottom-right .n-parent,
	.notification-container-top-right .n-parent {
		margin-left: auto;
	}
	.notification-container-bottom-left .n-parent,
	.notification-container-top-left .n-parent {
		margin-right: auto;
	}
	.notification-container-mobile-bottom .n-parent,
	.notification-container-mobile-top .n-parent {
		margin-left: auto;
		margin-right: auto;
	}
`;
