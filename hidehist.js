//. init
_common_lib();
var 
	fn_list = '%TEMP%\\hidehist.txt'.env_expand() ,
	tab_name = '*秀丸ヒストリ' ,
	bar_title = '秀丸エディタのファイル・フォルダヒストリ'
;

//.. hidefile のパス
var path_hidemaru = actx.shell.RegRead(
	'HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Hidemaru\\DisplayIcon'
);
// var path_hidemaru = 'c:\\program files\\hidemaru\\hidemaru.exe'
if ( ! path_hidemaru.is_file() ) {
	message( '秀丸エディタの実行ファイルが見つかりません' );
	endmacro();
}

//. main
var arg = [ getArg(0), getArg(1) ];

if ( arg[0] == 'make!' ) {
	//- カスタムファイルリスト
	if ( arg[1] ) {
		tab_name += ': ' + arg[1];
		bar_title += ' | フィルター: ' + arg[1];
	}
	_custom_fl( tab_name + ( arg[1] && ': ' + arg[1] ) );
} else {
	//- エディタマクロ起動
	var term = arg[1]
		|| input( '履歴を絞り込むフィルター文字列 (空白=フィルターなし)' )
		|| '*'
	;
	actx.shell.Run(
		path_hidemaru
			+ ' /h /x ' + ScriptFullName.replace( '.js', '.mac' ).q()
			+ ' /a ' + term.q()
			+ ' /a ' + 'close!'
	);
}
endMacro();

//. _custom_fl カスタムファイルリスト作成
function _custom_fl( tab_name, flg_tab_reuse ) {
	if ( ! flg_tab_reuse )
		Open( fn_list, 2 );
	CustomFileList( fn_list );
	SetTabName( tab_name, GetCurrentTab() );
	SetAttentionBar( bar_title );
	SetDirectory( fn_list.parent() );
}

//.. _common_lib
function _common_lib() {
	actx = {
		fs: new ActiveXObject( "Scripting.FileSystemObject" ) ,
		shell: new ActiveXObject( "WScript.Shell" )
	};

	//- 親ディレクトリ
	String.prototype.parent = function(){
		return actx.fs.GetParentFolderName( this );
	}

	//- basename
	String.prototype.basename = function(){
		return actx.fs.GetBaseName( this );
	}

	//- 拡張子
	String.prototype.ext = function(){
		return actx.fs.GetExtensionName( this );
	}

	// is_file
	String.prototype.is_file = function(){
		return actx.fs.FileExists( this );
	}

	// is_folder
	String.prototype.is_folder = function(){
		return actx.fs.FolderExists( this );
	}

	//- / => \
	String.prototype.yen = function(){
		return this.replace( /\//g, '\\' );
	}

	//- quote
	String.prototype.q = function( rep_to ){
		return '"' + this.replace( /"/g, rep_to || '""' )  + '"'; //'"'ダブルクオート
	}

	//- has
	String.prototype.has = function( needle ){
		return this.indexOf( needle ) != -1;
	}
	//- rightstr
	String.prototype.rightstr = function( num ) {
		return this.substr( this.length - num );
	}
	//- add_wildcard
	String.prototype.add_wildcard = function() {
		return this.has( '*' ) ? this : '*' + this + '*' 
	}
	//- trim
	String.prototype.trim = function() {
		return this.replace( /^\s+|\s+$/g, '' );
	}
	//- path_expand
	String.prototype.env_expand = function() {
		return actx.shell.ExpandEnvironmentStrings( this );
	}
	String.prototype.repeat = function(num) {
		for (var ret = ""; (this.length * num) > ret.length; ret += this);
		return ret;
	};
}

