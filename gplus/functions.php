<?php 
add_theme_support( 'automatic-feed-links' );
add_theme_support( 'post-thumbnails' );

if ( ! isset( $content_width ) ) $content_width = 900;



function gplus_widgets_init() {
	register_sidebar(array(
		'name' => __('Primary Widget Area', 'gplus'),
		'id' => 'primary-widget-area',
		'description' => __('The primary widget area', 'gplus'),
		'before_widget' => '<section class="widget">',
		'after_widget' => '</section>',
		'before_title' => '<h3>',
		'after_title' => '</h3>'
	));
}
add_action( 'widgets_init', 'gplus_widgets_init' );

function gplus_comment($comment, $args, $depth) {
   $GLOBALS['comment'] = $comment;
?>
<li class="clearfix">
	<a class="portrait" name="comment-<?php comment_ID();?>"><?php echo get_avatar($comment,$size='48',$default='' ); ?></a>
	<span style="display:block;"><?php comment_author_link() ?>&nbsp;&nbsp;<?php printf(__('%1$s at %2$s', 'gplus'), get_comment_date(),  get_comment_time()) ?></a><?php edit_comment_link(__('[Edit]'),' ','') ?></span>
	<?php if ($comment->comment_approved == '0') : ?>
	<em class="approved"><?php _e('Your comment is awaiting moderation.', 'gplus') ?></em>
	<?php endif; ?>
	<?php comment_text() ?>
</li>
<?php }

/* wp_list_comments()->pings callback */
function gplus_custom_pings($comment, $args, $depth) {
    $GLOBALS['comment'] = $comment;
    if('pingback' == get_comment_type()) $pingtype = 'Pingback';
    else $pingtype = 'Trackback';
?>
    <li>
        <?php comment_author_link(); ?> - <?php echo $pingtype; ?> on <?php echo mysql2date('Y/m/d/ H:i', $comment->comment_date); ?>
<?php }



if (function_exists('wp_nav_menu')) {
	register_nav_menus(array('primary' => __('Primary Navigation', 'gplus')));
}


load_theme_textdomain('gplus', get_template_directory() . '/lang/');


$gplus_items = array (
	array(
		'id' => 'logo_url',
		'name' => __('logo image URL', 'gplus'),
		'desc' => __('logo image url.(with http://), height is 28px, max width is 140px', 'gplus'),
		'type' => 'text'
	),
	array(
		'id' => '404img_url',
		'name' => __('404 image URL', 'gplus'),
		'desc' => __('404 page image URL. max width is 700px', 'gplus'),
		'type' => 'text'
	),
	array(
		'id' => 'cache_time',
		'name' => __('cache time', 'gplus'),
		'desc' => __('cache time. default is 1 day. 24 *3600 seconds. 0 is not cache', 'gplus'),
		'type' => 'text'
	),
	array(
		'id' => 'not_use_storage',
		'name' => __('not use storage?', 'gplus'),
		'desc' => __('use storage for cache content for next request', 'gplus'),
		'type' => 'checkbox'
	),
	array(
		'id' => 'show_fx',
		'name' => __('show fx?', 'gplus'),
		'desc' => __('animate for show content ', 'gplus'),
		'type' => 'radio'
	),
	array(
		'id' => 'header_not_fixed',
		'name' => __('header not fixed', 'gplus'),
		'desc' => __('header not fixed?', 'gplus'),
		'type' => 'checkbox'
	),
	array(
		'id' => 'show_author',
		'name' => __('show author', 'gplus'),
		'desc' => __('display author in article list?', 'gplus'),
		'type' => 'checkbox'
	),
	array(
		'id' => 'manifest_value',
		'name' => __('manifest value', 'gplus'),
		'desc' => __('just in chrome & firefox', 'gplus'),
		'type' => 'textarea',
		'default_value' => "CACHE MANIFEST\n\n# VERSION 0.4\n\nCACHE:\nwp-content/themes/gplus/js/jquery.js\n\nNETWORK:\nwp-admin/\n"
	),
);
add_action( 'admin_init', 'gplus_theme_options_init' );
add_action( 'admin_menu', 'gplus_theme_options_add_page' );
function gplus_theme_options_init(){
	register_setting( 'gplus_options', 'gplus_options', 'gplus_options_validate' );
}
function gplus_default_options() {
	global $gplus_items;
	$options = get_option( 'gplus_options' );
	foreach ( $gplus_items as $item ) {
		if ( ! isset( $options[$item['id']] ) ) {
			$options[$item['id']] = '';
		}
	}
	update_option( 'gplus_options', $options );
}
add_action( 'init', 'gplus_default_options' );
function gplus_theme_options_add_page() {
	add_theme_page( __( 'Theme Options' , 'gplus'), 
					__( 'Theme Options' , 'gplus'), 
					'edit_theme_options', 
					'theme_options', 
					'gplus_theme_options_do_page' );
}

function gplus_theme_options_do_page() {
	global $gplus_items;
	if (gplus_is_post()){
		echo 111;
	}
	if ( ! isset( $_REQUEST['updated'] ) )
		$_REQUEST['updated'] = false;
?>
<div class="wrap">
	<?php screen_icon(); echo "<h2>" . sprintf( __( '%1$s Theme Options' , 'gplus'), get_current_theme() )	 . "</h2>"; ?>
	<?php if ( false !== $_REQUEST['updated'] ) : ?>
	<div class="updated fade"><p><strong><?php _e( 'Options saved' , 'gplus'); ?></strong></p></div>
	<?php endif; ?>
	<form method="post" action="options.php">
		<?php settings_fields( 'gplus_options' ); ?>
		<?php $options = get_option( 'gplus_options' ); ?>
		<table class="form-table">
		<?php foreach ($gplus_items as $item) { ?>
			<tr valign="top" style="margin:0 10px;border-bottom:1px solid #ddd;">
				<th scope="row"><?php echo $item['name']; ?></th>
				<td>
					<?php if ($item['type'] == 'radio'):?>
					<input  name="<?php echo 'gplus_options['.$item['id'].']'; ?>" type="<?php echo $item['type']?>" value="" <?php if (!$options[$item['id']]):?>checked<?php endif;?>/> none
					&nbsp;&nbsp;<input  name="<?php echo 'gplus_options['.$item['id'].']'; ?>" type="<?php echo $item['type']?>" value="fade" <?php if ($options[$item['id']] == 'fade'):?>checked<?php endif;?>/> fade
					<?php elseif ($item['type'] == 'checkbox'):?>
					<input  name="<?php echo 'gplus_options['.$item['id'].']'; ?>" type="<?php echo $item['type']?>" value="true" <?php if ($options[$item['id']]):?>checked<?php endif;?> size="80" />
					<?php elseif ($item['type'] == 'textarea'):?>
					<textarea style="width:500px"  name="<?php echo 'gplus_options['.$item['id'].']'; ?>" rows="8" cols="50"><?php if ($options[$item['id']]){ echo $options[$item['id']];} else {echo $item['default_value'];} ; ?></textarea>
					
					<?php else:?>
					<input style="width:500px" name="<?php echo 'gplus_options['.$item['id'].']'; ?>" type="<?php echo $item['type']?>" <?php if ( $options[$item['id']] != "") {?>value="<?php echo $options[$item['id']]; ?>"<?php }else{?>value=""<?php } ?> size="80" />
					<?php endif;?>
					<br/>
					<label class="description" for="<?php echo 'gplus_options['.$item['id'].']'; ?>"><?php echo $item['desc']; ?></label>
				</td>
			</tr>
		<?php } ?>
		</table>
		<p class="submit">
			<input type="submit" class="button-primary" value="<?php _e( 'Save Options' , 'gplus'); ?>" />
		</p>
	</form>
</div>
<?php
}

function gplus_options_validate($input) {
	global $gplus_items;
	foreach ( $gplus_items as $item ) {
		$input[$item['id']] = wp_filter_nohtml_kses($input[$item['id']]);
	}
	return $input;
}

function gplus_is_pjax(){
	return array_key_exists('HTTP_X_PJAX', $_SERVER) && $_SERVER['HTTP_X_PJAX'] === 'true';
}
function gplus_is_get()
{
	return $_SERVER['REQUEST_METHOD'] == 'GET';
}
/**
 * 检测请求方式是否为POST
 */
function gplus_is_post()
{
	return $_SERVER['REQUEST_METHOD'] == 'POST';
}
function gplus_is_ie(){
	return !!(strpos($_SERVER["HTTP_USER_AGENT"], "MSIE") !== false);
}
function gplus_is_ie6(){
	return !!(strpos($_SERVER["HTTP_USER_AGENT"], "MSIE 6") !== false);
}