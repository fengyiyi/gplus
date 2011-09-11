<?php if (!gplus_is_pjax()) { get_header();?>
<div id="content">
<?php };?>


	<?php the_post();$options = gplus_get_options(); ?>
	<article class="detail">
		<h2 class="title"><?php the_title() ?></h2>
		<p class="desc">
		<?php if ($options['show_author']):?>
		<?php printf(__('Author：%s', 'gplus'), get_the_author_meta('display_name')); ?>&nbsp;&nbsp;&nbsp;
		<?php endif;?>
		<?php printf(__('IN：%s', 'gplus'), get_the_category_list(', ')); ?>&nbsp;&nbsp;&nbsp;
		<?php the_tags(__('Tags:', 'gplus') . ' ', ', ', ''); ?> &nbsp;&nbsp;&nbsp;
		<?php _e('Comments：', 'gplus') . comments_popup_link('0', '1', '%', '', '已关闭'); ?>
		</p>
		<div class="detail">
			<?php if ( $options['excerpt_check']=='true' ) { the_excerpt(__('Read more &raquo;', 'gplus')); } else { the_content(__('Read more &raquo;', 'gplus')); } ?>
		<?php if(is_sticky()) { ?>
			<p><?php _e('This is a sticky post!', 'gplus'); ?> <a href="<?php the_permalink() ?>" class="more-links"><?php _e('continue reading?', 'gplus'); ?></a></p>
		<?php } ?>
		</div>
		<div class="date" title="<?php the_time("Y-m-d H:i:s")?>">
			<div class="md"><?php the_time('m-d'); ?></div>
			<div class="y"><?php the_time('Y'); ?></div>
		</div>
	</article>
	<?php comments_template( '', true ); ?>
	
<?php if (!gplus_is_pjax()) {?>
</div>
<?php get_sidebar() ?>
<?php get_footer() ?>
<?php };?>