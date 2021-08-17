<?php
/**
 * Plugin Name: My Gutenberg Admin Plugin
 */

// オプションページの追加
function my_plugin_menu() {
	add_options_page(
		'My Gutenberg Admin Plugin', // メニューを選択した時にページのタイトルタグに表示されるテキスト
		'My Gutenberg Admin Plugin', // メニューで表示されるテキスト
		'administrator',             // メニューを使用出来る権限（今回は管理者）
		'my-gutenberg-admin-plugin', // スラッグ名（URLの一部にもなる）
		'my_settings_page'           // コールバック関数
	);
};
add_action( 'admin_menu', 'my_plugin_menu' );

// オプションページのコンテンツ
function my_settings_page() {
	echo '<div id="my-gutenberg-admin-plugin"></div>';
}
