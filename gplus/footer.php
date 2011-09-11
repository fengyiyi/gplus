</div>
<?php flush(); ?>
<footer>
	&copy; <?php echo date("Y"); ?>&nbsp;<?php bloginfo('name'); ?> - <a href="http://wordpress.org/">WordPress</a> - <a href="http://www.welefen.com/google-plus-for-wordpress-theme.html" title="gplus theme designed by welefen">gplus</a>
</footer>
<?php wp_footer();?>
<?php $options = gplus_get_options();?>
<?php if (!gplus_is_ie() && !($options['not_use_ajax'])):?>
<div class="loading"><span>loading...</span></div>
<script>var pjaxHomeUrl = "<?php echo home_url();?>", pjaxTitleSuffix="<?php bloginfo('name'); ?>", pjaxUseStorage=<?php if ($options['not_use_storage']):?>false<?php else :?>true<?php endif;?>, pjaxCacheTime=<?php if (strlen($options['cache_time'])):echo intval($options['cache_time'])?><?php else :?>true<?php endif;?>, pjaxFx="<?php echo $options['show_fx']?>";</script>
<script src="<?php echo get_stylesheet_directory_uri(true);?>/js/jquery.js"></script>
<script src="<?php echo get_stylesheet_directory_uri(true);?>/js/plus.js"></script>
<!--<script type="text/javascript" src="http://img.baidu.com/js/tangram-base-1.3.9.js"></script>
<script src="http://www/pjax/tangram.pjax.js"></script>-->
<?php endif;?>
</body>
</html>