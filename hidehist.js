//. init
_common_lib();
var 
	fn_list = '%TEMP%\\hidehist.txt'.env_expand() ,
	tab_name = '*�G�ۃq�X�g��' ,
	bar_title = '�G�ۃG�f�B�^�̃t�@�C���E�t�H���_�q�X�g��'
;

//.. hidefile �̃p�X
var path_hidemaru = actx.shell.RegRead(
	'HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\Hidemaru\\DisplayIcon'
);
// var path_hidemaru = 'c:\\program files\\hidemaru\\hidemaru.exe'
if ( ! path_hidemaru.is_file() ) {
	message( '�G�ۃG�f�B�^�̎��s�t�@�C����������܂���' );
	endmacro();
}

//. main
var arg = [ getArg(0), getArg(1) ];

if ( arg[0] == 'make!' ) {
	//- �J�X�^���t�@�C�����X�g
	if ( arg[1] ) {
		tab_name += ': ' + arg[1];
		bar_title += ' | �t�B���^�[: ' + arg[1];
	}
	_custom_fl( tab_name + ( arg[1] && ': ' + arg[1] ) );
} else {
	//- �G�f�B�^�}�N���N��
	var term = arg[1]
		|| input( '�������i�荞�ރt�B���^�[������ (��=�t�B���^�[�Ȃ�)' )
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

//. _custom_fl �J�X�^���t�@�C�����X�g�쐬
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

	//- �e�f�B���N�g��
	String.prototype.parent = function(){
		return actx.fs.GetParentFolderName( this );
	}

	//- basename
	String.prototype.basename = function(){
		return actx.fs.GetBaseName( this );
	}

	//- �g���q
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
		return '"' + this.replace( /"/g, rep_to || '""' )  + '"'; //'"'�_�u���N�I�[�g
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

